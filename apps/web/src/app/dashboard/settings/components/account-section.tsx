"use client";

import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";

import { AppearanceSection } from "./appearance-section";
import { DangerZoneSection } from "./danger-zone-section";
import { ProfileSection } from "./profile-section";
import { WorkspaceSection } from "./workspace-section";

export const AccountSection = (): React.ReactElement => (
  <motion.div
    variants={staggerContainer()}
    initial="hidden"
    animate="visible"
    className="flex flex-col gap-6"
  >
    <motion.div variants={fadeInUp}>
      <ProfileSection />
    </motion.div>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <AppearanceSection />
      <WorkspaceSection />
    </motion.div>

    <motion.div variants={fadeInUp}>
      <DangerZoneSection />
    </motion.div>
  </motion.div>
);
