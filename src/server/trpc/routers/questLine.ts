import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const questLineRouter = createTRPCRouter({
  // Obtener todas las quest lines con sus quests
  getAll: publicProcedure.query(async ({ ctx }) => {
    const questLines = await ctx.prisma.questLine.findMany({
      include: {
        quests: {
          include: {
            progress: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });
    return questLines;
  }),

  // Obtener quest lines con progreso de un usuario específico
  getWithProgress: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const questLines = await ctx.prisma.questLine.findMany({
        include: {
          quests: {
            include: {
              progress: {
                where: {
                  userId: input.userId,
                },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });
      return questLines;
    }),

  // Sincronizar/crear quest line desde Minecraft
  sync: publicProcedure
    .input(
      z.object({
        questLineId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const questLine = await ctx.prisma.questLine.upsert({
        where: {
          questLineId: input.questLineId,
        },
        update: {
          name: input.name,
          description: input.description,
          order: input.order ?? 0,
        },
        create: {
          questLineId: input.questLineId,
          name: input.name,
          description: input.description,
          order: input.order ?? 0,
        },
      });
      return questLine;
    }),

  // Obtener una quest line específica
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.questLine.findUnique({
        where: { id: input.id },
        include: {
          quests: {
            include: {
              progress: true,
            },
          },
        },
      });
    }),
});
