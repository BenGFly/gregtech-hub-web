import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from './trpc';
import { prisma } from '@/lib/prisma';
import { questRouter } from './routers/quest';
import { questLineRouter } from './routers/questLine';

const taskRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await prisma.task.findMany({
      include: {
        assignedTo: true,
        materials: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
        assignedToId: z.string().optional(),
        questId: z.string().optional(),
        questName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.task.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.task.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.task.delete({
        where: { id: input.id },
      });
    }),
});

// Quest router importado desde ./routers/quest.ts

const materialRouter = createTRPCRouter({
  addToTask: publicProcedure
    .input(
      z.object({
        taskId: z.string(),
        name: z.string(),
        quantity: z.number().int().positive(),
        unit: z.string().optional(),
        itemId: z.string().optional(),
        nbtData: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.material.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        quantity: z.number().int().positive().optional(),
        obtained: z.number().int().min(0).optional(),
        unit: z.string().optional(),
        itemId: z.string().optional(),
        nbtData: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.material.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.material.delete({
        where: { id: input.id },
      });
    }),

  getByTask: publicProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.material.findMany({
        where: { taskId: input.taskId },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }),
});

const userRouter = createTRPCRouter({
  getOrCreate: publicProcedure
    .input(
      z.object({
        minecraftUUID: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.user.upsert({
        where: { minecraftUUID: input.minecraftUUID },
        create: input,
        update: { username: input.username },
      });
    }),

  getAll: publicProcedure.query(async () => {
    return await prisma.user.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
            questProgress: true,
          },
        },
      },
    });
  }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.user.delete({
        where: { id: input.id },
      });
    }),
});

export const appRouter = createTRPCRouter({
  task: taskRouter,
  quest: questRouter,
  questLine: questLineRouter,
  user: userRouter,
  material: materialRouter,
});

export type AppRouter = typeof appRouter;
