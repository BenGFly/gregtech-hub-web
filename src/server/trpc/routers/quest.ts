import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const questRouter = createTRPCRouter({
  // Obtener todas las quests
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.quest.findMany({
      include: {
        questLine: true,
        progress: true,
      },
    });
  }),

  // Obtener quests de una quest line específica
  getByLine: publicProcedure
    .input(z.object({ questLineId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.quest.findMany({
        where: {
          questLineId: input.questLineId,
        },
        include: {
          questLine: true,
          progress: true,
        },
      });
    }),

  // Obtener progreso de un usuario
  getProgress: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.questProgress.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          quest: {
            include: {
              questLine: true,
            },
          },
        },
      });
    }),

  // Sincronizar quest desde Minecraft
  syncQuest: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        questId: z.string(),
        questName: z.string(),
        questLine: z.string().optional(),
        completed: z.boolean(),
        unlocked: z.boolean().optional(),
        description: z.string().optional(),
        taskLogic: z.string().optional(),
        tasks: z.any().optional(),
        rewards: z.any().optional(),
        prerequisites: z.array(z.string()).optional(),
        questLineId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Asegurar que el usuario existe (especialmente para el usuario "system")
      if (input.userId) {
        await ctx.prisma.user.upsert({
          where: { id: input.userId },
          update: {},
          create: {
            id: input.userId,
            minecraftUUID: input.userId === "system" ? "00000000-0000-0000-0000-000000000000" : input.userId,
            username: input.userId === "system" ? "System" : "Unknown",
          },
        });
      }

      // Primero asegurar que la quest existe
      const quest = await ctx.prisma.quest.upsert({
        where: {
          questId: input.questId,
        },
        update: {
          name: input.questName,
          description: input.description,
          taskLogic: input.taskLogic ?? "AND",
          tasks: input.tasks,
          rewards: input.rewards,
          prerequisites: input.prerequisites ?? [],
        },
        create: {
          questId: input.questId,
          name: input.questName,
          description: input.description,
          questLineId: input.questLineId,
          taskLogic: input.taskLogic ?? "AND",
          tasks: input.tasks,
          rewards: input.rewards,
          prerequisites: input.prerequisites ?? [],
        },
      });

      // Luego actualizar el progreso del usuario
      const progress = await ctx.prisma.questProgress.upsert({
        where: {
          userId_questId: {
            userId: input.userId,
            questId: input.questId,
          },
        },
        update: {
          questName: input.questName,
          questLine: input.questLine,
          completed: input.completed,
          unlocked: input.unlocked ?? true,
          completedAt: input.completed ? new Date() : null,
        },
        create: {
          userId: input.userId,
          questId: input.questId,
          questName: input.questName,
          questLine: input.questLine,
          completed: input.completed,
          unlocked: input.unlocked ?? true,
          completedAt: input.completed ? new Date() : null,
        },
      });

      return { quest, progress };
    }),

  // Obtener una quest específica
  getById: publicProcedure
    .input(z.object({ questId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.quest.findUnique({
        where: { questId: input.questId },
        include: {
          questLine: true,
          progress: true,
        },
      });
    }),

  // Obtener estadísticas de quests
  getStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const total = await ctx.prisma.quest.count();
      const completed = await ctx.prisma.questProgress.count({
        where: {
          userId: input.userId,
          completed: true,
        },
      });
      const unlocked = await ctx.prisma.questProgress.count({
        where: {
          userId: input.userId,
          unlocked: true,
          completed: false,
        },
      });

      return {
        total,
        completed,
        unlocked,
        locked: total - completed - unlocked,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    }),
});
