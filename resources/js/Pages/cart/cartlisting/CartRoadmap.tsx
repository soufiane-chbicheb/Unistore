import React from 'react';
import { CheckCircle2, Gift, Truck, X } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Milestone } from "./CartPage";
import { usePage } from "@inertiajs/react";

interface CartRoadmapProps {
    subtotal: number;
    milestones: Milestone[];
    theme: ThemePalette;
    onClose: () => void;
}

export default function CartRoadmap({ subtotal, milestones, theme, onClose }: CartRoadmapProps) {
    const { storeCurrency } = usePage().props as any;
    if (milestones.length === 0) return null;

    const reachedCount = milestones.filter(m => subtotal >= m.goal).length;
    const maxGoal = Math.max(...milestones.map(m => m.goal));
    const progressPercentage = Math.min(100, (subtotal / maxGoal) * 100);

    return (
        <div 
            style={{ 
                backgroundColor: theme.card, 
                borderColor: theme.border,
                borderRadius: theme.borderRadius,
                boxShadow: theme.shadowMd
            }}
            className="mb-12 p-6 pt-16 pb-16 border border-slate-100 shadow-sm relative group animate-in fade-in slide-in-from-top-4 duration-500 overflow-visible"
        >
            {/* Close Button */}
            <button 
                onClick={onClose}
                style={{ color: theme.textMuted }}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition-colors z-40"
            >
                <X size={16} />
            </button>

            <div className="relative h-2 px-4 mb-4">
                {/* Background Track */}
                <div 
                    className="absolute top-0 left-0 w-full h-full rounded-full"
                    style={{ backgroundColor: `${theme.primary}15` }}
                />
                
                {/* Active Progress */}
                <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                        width: `${progressPercentage}%`, 
                        backgroundColor: theme.primary,
                        boxShadow: `0 0 15px ${theme.primary}40`
                    }}
                />

                {/* Milestones */}
                {milestones.map((m, idx) => {
                    const isReached = subtotal >= m.goal;
                    const pos = maxGoal > 0 ? (m.goal / maxGoal) * 100 : 0;
                    
                    return (
                        <div 
                            key={idx}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${pos}%` }}
                        >
                            <div 
                                className="relative flex flex-col items-center"
                                style={{ transform: 'translateX(-50%)' }}
                            >
                                {/* Goal Top */}
                                <div className="absolute bottom-6 text-center transform -translate-y-1">
                                    <span 
                                        className="text-[11px] font-bold whitespace-nowrap block px-2 py-0.5 rounded-full"
                                        style={{ 
                                            backgroundColor: isReached ? `${theme.success}15` : 'transparent',
                                            color: isReached ? theme.success : theme.textMuted 
                                        }}
                                    >
                                        {m.goal.toLocaleString()} {storeCurrency}
                                    </span>
                                </div>

                                {/* Marker */}
                                <div 
                                    style={{ 
                                        backgroundColor: isReached ? theme.success : theme.card,
                                        borderColor: isReached ? theme.success : theme.border,
                                        color: isReached ? 'white' : theme.textMuted,
                                        boxShadow: isReached ? `0 0 12px ${theme.success}40` : `0 0 5px rgba(0,0,0,0.05)`,
                                        zIndex: 30
                                    }}
                                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-110 cursor-pointer"
                                >
                                    {isReached ? (
                                        <CheckCircle2 size={14} strokeWidth={3} />
                                    ) : (
                                        m.type === 'free_shipping' ? <Truck size={12} /> : <Gift size={12} />
                                    )}
                                </div>

                                {/* Message Bottom */}
                                <div className="absolute top-8 text-center w-[140px]">
                                    <div 
                                        className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md"
                                        style={{ 
                                            color: isReached ? theme.success : theme.text,
                                            backgroundColor: isReached ? `${theme.success}10` : 'transparent',
                                            border: isReached ? `1px solid ${theme.success}20` : 'none'
                                        }}
                                    >
                                        {isReached ? m.label + " SAVED" : m.message}
                                    </div>
                                    {!isReached && (
                                        <div 
                                            className="text-[8px] mt-0.5 opacity-60 font-medium"
                                            style={{ color: theme.textMuted }}
                                        >
                                            Next Milestone
                                        </div>
                                    )}
                                </div>

                                {/* Pulse Effect for current target */}
                                {!isReached && milestones.slice(0, idx).every(prev => subtotal >= prev.goal) && (
                                    <div 
                                        className="absolute w-10 h-10 rounded-full animate-ping opacity-20 z-0"
                                        style={{ backgroundColor: theme.primary }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
