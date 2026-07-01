import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../ui/Card";
import { useMusic } from "../../../context/MusicContext";

interface MusicInsightsProps {
  itemVariants: any;
}

export const MusicInsights: React.FC<MusicInsightsProps> = ({
  itemVariants,
}) => {
  const { tracks } = useMusic();

  return (
    <motion.section variants={itemVariants} className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-2 bg-accent/10 rounded-xl">
          <Sparkles className="text-accent" size={20} />
        </div>
        <h2 className="text-3xl font-black tracking-tight">Insights</h2>
      </div>
      <Card className="bg-gradient-to-br from-surface to-accent/5 p-8 border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <p className="text-sm text-text-secondary mb-8 leading-relaxed font-bold">
          Your sonic profile is evolving. Based on{" "}
          <span className="text-text-primary font-black">
            {tracks.length} tracks
          </span>{" "}
          analyzed in your vault.
        </p>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black tracking-[0.2em]">
              <span className="opacity-50">Cohesion</span>
              <span className="text-accent">84%</span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "84%" }}
                transition={{ duration: 1.5, ease: "circOut", delay: 1 }}
                className="h-full bg-accent"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black tracking-[0.2em]">
              <span className="opacity-50">Discovery Range</span>
              <span className="text-accent">72%</span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ duration: 1.5, ease: "circOut", delay: 1.2 }}
                className="h-full bg-accent"
              />
            </div>
          </div>
        </div>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('nav:tab', { detail: 'stats' }))}
          className="w-full mt-10 py-4 bg-accent/10 hover:bg-accent/20 text-accent text-[10px] font-black tracking-[0.3em] rounded-[13px] transition-all border border-accent/20 active:scale-95"
        >
          Sync Model
        </button>
      </Card>
    </motion.section>
  );
};
