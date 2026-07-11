"use client";

import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";

import { InviteMemberButton } from "../../team/members/components/invite-member-button";
import { MembersList } from "../../team/members/components/members-list";
import { NewProjectButton } from "../../team/projects/components/new-project-button";
import { ProjectsList } from "../../team/projects/components/projects-list";
import { SettingsCard } from "./settings-card";

export const TeamSection = (): React.ReactElement => (
  <motion.div
    variants={staggerContainer()}
    initial="hidden"
    animate="visible"
    className="flex flex-col gap-6"
  >
    <motion.div variants={fadeInUp}>
      <SettingsCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Projects</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Switch your active workspace or create a new one.
            </p>
          </div>
          <NewProjectButton />
        </div>
        <div className="mt-6">
          <ProjectsList />
        </div>
      </SettingsCard>
    </motion.div>

    <motion.div variants={fadeInUp}>
      <SettingsCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Members</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              People with access to this project.
            </p>
          </div>
          <InviteMemberButton />
        </div>
        <div className="mt-6">
          <MembersList />
        </div>
      </SettingsCard>
    </motion.div>
  </motion.div>
);
