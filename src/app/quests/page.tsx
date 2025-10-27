"use client";

import { useState } from "react";
import { GiBookCover, GiCheckMark, GiTargetArrows } from "react-icons/gi";
import { FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/contexts/AuthContext";

export default function QuestsPage() {
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  
  // Usar el usuario autenticado del contexto
  const { userId, username, isAuthenticated } = useAuth();

  // Las QUESTS tienen progreso INDIVIDUAL por jugador
  // Cada miembro del equipo tiene su propio avance en las misiones
  const { data: questLines, isLoading: loadingQuests } = trpc.questLine.getWithProgress.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );
  const { data: questStats } = trpc.quest.getStats.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );

  const isLoading = loadingQuests;

  const selectedLine = questLines?.find((line: any) => line.id === selectedLineId);
  const selectedQuest = selectedLine?.quests.find((q: any) => q.id === selectedQuestId);

  // Seleccionar la primera línea automáticamente
  if (!selectedLineId && questLines && questLines.length > 0) {
    setSelectedLineId(questLines[0]!.id);
  }

  // Mostrar mensaje si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900">
        <div className="glass max-w-md rounded-2xl border-2 border-purple-500/30 p-8 text-center">
          <GiBookCover className="mx-auto h-24 w-24 text-purple-400" />
          <h2 className="mt-4 text-2xl font-bold text-white">Inicia Sesión</h2>
          <p className="mt-2 text-gray-400">
            Haz click en "Iniciar Sesión" en la esquina superior derecha para ver tus quests
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Cargando quests...</p>
        </div>
      </div>
    );
  }

  if (!questLines || questLines.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg border border-purple-500/20 bg-zinc-900/50 p-12 text-center backdrop-blur-sm">
            <GiBookCover className="mx-auto h-24 w-24 text-gray-600" />
            <h2 className="mt-4 text-2xl font-bold text-white">No hay quests disponibles</h2>
            <p className="mt-2 text-gray-400">
              Las quests se sincronizarán automáticamente cuando te conectes al servidor de Minecraft
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 rounded-lg border border-purple-500/20 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 p-3">
                <GiBookCover className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Quest Book</h1>
                <p className="text-gray-400">Progreso de {username} en GTNH</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                {questStats?.completed ?? 0}/{questStats?.total ?? 0}
              </div>
              <div className="text-sm text-gray-400">Quests Completadas</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${questStats?.percentage ?? 0}%` }}
              />
            </div>
            <p className="mt-2 text-center text-sm text-gray-400">
              {questStats?.percentage ?? 0}% Completado
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Quest Lines */}
          <div className="col-span-3">
            <div className="sticky top-24 space-y-2">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <GiTargetArrows className="text-purple-400" />
                Quest Lines
              </h2>
              
              {questLines.map((line) => {
                const lineCompleted = line.quests.filter((q: any) => 
                  q.progress.some((p: any) => p.userId === userId && p.completed)
                ).length;
                const lineTotal = line.quests.length;
                
                return (
                  <button
                    key={line.id}
                    onClick={() => {
                      setSelectedLineId(line.id);
                      setSelectedQuestId(null);
                    }}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      selectedLineId === line.id
                        ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20"
                        : "border-zinc-700 bg-zinc-800/50 hover:border-purple-500/50 hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{line.name}</span>
                      <IoIosArrowForward className={`text-gray-400 transition-transform ${
                        selectedLineId === line.id ? "rotate-90" : ""
                      }`} />
                    </div>
                    {lineTotal > 0 && (
                      <div className="mt-2 text-xs text-gray-400">
                        {lineCompleted}/{lineTotal} quests
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quest Tree View */}
          <div className="col-span-6">
            <div className="rounded-lg border border-purple-500/20 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-2xl font-bold text-white">
                {selectedLine?.name}
              </h2>
              
              {selectedLine && selectedLine.quests.length > 0 ? (
                <div className="space-y-3">
                  {selectedLine.quests.map((quest: any) => {
                    const progress = quest.progress.find((p: any) => p.userId === userId);
                    const isCompleted = progress?.completed ?? false;
                    const isUnlocked = progress?.unlocked ?? false;
                    
                    return (
                      <button
                        key={quest.id}
                        onClick={() => setSelectedQuestId(quest.id)}
                        className={`w-full rounded-lg border p-4 text-left transition-all ${
                          isCompleted
                            ? "border-green-500/50 bg-green-900/20 hover:bg-green-900/30"
                            : isUnlocked
                            ? "border-purple-500/50 bg-purple-900/20 hover:bg-purple-900/30"
                            : "border-zinc-700 bg-zinc-800/30 opacity-60"
                        } ${
                          selectedQuestId === quest.id
                            ? "ring-2 ring-purple-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 rounded-full p-2 ${
                            isCompleted
                              ? "bg-green-500"
                              : isUnlocked
                              ? "bg-purple-500"
                              : "bg-zinc-600"
                          }`}>
                            {isCompleted ? (
                              <GiCheckMark className="h-4 w-4 text-white" />
                            ) : isUnlocked ? (
                              <GiTargetArrows className="h-4 w-4 text-white" />
                            ) : (
                              <FaLock className="h-4 w-4 text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{quest.name}</h3>
                            <p className="mt-1 text-sm text-gray-400">{quest.description}</p>
                            
                            {quest.prerequisites && quest.prerequisites.length > 0 && (
                              <div className="mt-2 text-xs text-gray-500">
                                Requiere: {quest.prerequisites.length} quest(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-800/30 p-12 text-center">
                  <GiBookCover className="mx-auto h-16 w-16 text-zinc-600" />
                  <p className="mt-4 text-gray-400">No hay quests en esta línea aún</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Las quests se sincronizarán automáticamente desde Minecraft
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quest Details */}
          <div className="col-span-3">
            <div className="sticky top-24 rounded-lg border border-purple-500/20 bg-zinc-900/50 p-6 backdrop-blur-sm">
              {selectedQuest ? (
                <div>
                  {(() => {
                    const progress = selectedQuest.progress.find((p: any) => p.userId === userId);
                    const isCompleted = progress?.completed ?? false;
                    const isUnlocked = progress?.unlocked ?? false;
                    
                    return (
                      <>
                        <div className="mb-4 flex items-center gap-2">
                          <div className={`rounded-full p-2 ${
                            isCompleted
                              ? "bg-green-500"
                              : isUnlocked
                              ? "bg-purple-500"
                              : "bg-zinc-600"
                          }`}>
                            {isCompleted ? (
                              <GiCheckMark className="h-5 w-5 text-white" />
                            ) : isUnlocked ? (
                              <GiTargetArrows className="h-5 w-5 text-white" />
                            ) : (
                              <FaLock className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-white">Detalles</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-400">Quest</label>
                            <p className="mt-1 text-white">{selectedQuest.name}</p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-400">Estado</label>
                            <p className="mt-1">
                              {isCompleted ? (
                                <span className="text-green-400">✓ Completada</span>
                              ) : isUnlocked ? (
                                <span className="text-purple-400">● En progreso</span>
                              ) : (
                                <span className="text-gray-500">🔒 Bloqueada</span>
                              )}
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-400">Descripción</label>
                            <p className="mt-1 text-sm text-gray-300">{selectedQuest.description || 'Sin descripción'}</p>
                          </div>

                          {selectedQuest.taskLogic && (
                            <div>
                              <label className="text-sm font-medium text-gray-400">Lógica de Tareas</label>
                              <p className="mt-1 text-sm text-purple-400">{selectedQuest.taskLogic}</p>
                            </div>
                          )}

                          {selectedQuest.prerequisites && selectedQuest.prerequisites.length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-gray-400">Pre-requisitos</label>
                              <div className="mt-2 space-y-1">
                                {selectedQuest.prerequisites.map((prereqId: string) => (
                                  <div key={prereqId} className="text-sm text-gray-400">
                                    • Quest requerida
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center">
                  <GiBookCover className="mx-auto h-16 w-16 text-zinc-600" />
                  <p className="mt-4 text-gray-400">Selecciona una quest</p>
                  <p className="mt-2 text-sm text-gray-500">
                    para ver sus detalles
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
