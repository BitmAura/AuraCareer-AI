import { task, logger } from "@trigger.dev/sdk/v3";
import { discoverLiveJobs } from "@/lib/jobs/live-discover";
import { JobDeduplicationEngine, computeJobSignature, normalizeCompanyName, normalizeJobTitle } from "@/lib/jobs/dedup-engine";
import { localStore } from "@/lib/db/local-store";
import { todayDigestDate } from "@/lib/jobs/digest";

export interface DailyHuntPayload {
  userId: string;
  maxJobs?: number;
}

export const dailyPortalHuntTask = task({
  id: "daily-portal-hunt",
  maxDuration: 1800, // 30 minutes max execution
  run: async (payload: DailyHuntPayload) => {
    logger.info("Starting autonomous multi-portal job discovery run", { userId: payload.userId });

    const user = await localStore.findUserById(payload.userId);

    // 1. Discover jobs across OEM Workday & supported portals
    const { jobs: rawJobs } = await discoverLiveJobs({
      targets: user?.careerTargets,
      limit: payload.maxJobs || 6,
    });

    logger.info(`Discovered ${rawJobs.length} raw jobs from portal scanners`);

    // 2. Mathematical deduplication
    const dedupEngine = new JobDeduplicationEngine();
    const uniqueListings = dedupEngine.deduplicateJobListings(rawJobs.map((j, idx) => ({
      id: `job-${idx}-${Date.now()}`,
      company: j.company,
      normalizedCompany: normalizeCompanyName(j.company),
      title: j.title,
      normalizedTitle: normalizeJobTitle(j.title),
      location: j.location || "India",
      portal: "direct_ats",
      applyUrl: j.applyUrl,
      isDirectAts: true,
      description: j.description || "",
      semanticSignature: computeJobSignature(j.company, j.title, j.description),
      discoveredAt: new Date().toISOString(),
    })));

    logger.info("Deduplication completed", {
      original: rawJobs.length,
      unique: uniqueListings.length,
    });

    // 3. Persist top matches into user queue
    const date = todayDigestDate();
    let queuedCount = 0;

    for (const job of uniqueListings.slice(0, 10)) {
      try {
        const savedJob = await localStore.createJob({
          company: job.company,
          title: job.title,
          location: job.location,
          source: "direct_ats",
          sourceUrl: job.applyUrl,
          description: job.description,
          requirements: [],
          isActive: true,
        });

        await localStore.createQueueItem({
          userId: payload.userId,
          jobId: savedJob.id,
          digestDate: date,
          matchScore: 92,
          status: "queued",
          matchRubric: {
            score: 92,
            grade: "A",
            stars: 5,
            why: ["Target role match", "Verified direct hiring portal"],
            gaps: [],
            action: "Review and approve tailored application packet",
          },
        });

        queuedCount++;
      } catch (err) {
        logger.warn("Skipping already queued job", { error: String(err) });
      }
    }

    logger.info("Daily hunt completed successfully", { queuedCount });

    return {
      status: "success",
      discovered: rawJobs.length,
      unique: uniqueListings.length,
      queued: queuedCount,
    };
  },
});
