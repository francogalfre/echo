"use client";

import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";

import { useRole } from "../../../hooks/use-role";

import { AppearanceSection } from "./appearance-section";
import { DangerZoneSection } from "./danger-zone-section";
import { ProfileSection } from "./profile-section";
import { WorkspaceSection } from "./workspace-section";

export const AccountSection = (): React.ReactElement => {
  const { isAdmin } = useRole();

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fadeInUp}>
        <ProfileSection />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <AppearanceSection />
      </motion.div>

      {isAdmin ? (
        <motion.div variants={fadeInUp}>
          <WorkspaceSection />
        </motion.div>
      ) : null}

      <motion.div variants={fadeInUp}>
        <DangerZoneSection canDeleteWorkspace={isAdmin} />
      </motion.div>
    </motion.div>
  );
};
