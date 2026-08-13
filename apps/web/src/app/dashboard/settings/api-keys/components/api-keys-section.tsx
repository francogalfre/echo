"use client";

import { Skeleton } from "@echo/ui/components/skeleton";
import { fadeInUp, staggerContainer } from "@echo/ui/lib/motion";
import { motion } from "motion/react";

import { KeysSection } from "@/app/dashboard/components/api-keys/keys-section";
import { useApiKeys, type ApiKeysInitial } from "@/app/dashboard/hooks/use-api-keys";

type ApiKeysSectionProps = {
  readonly initialKeys: ApiKeysInitial;
};

export function ApiKeysSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

export const ApiKeysSection = ({
  initialKeys,
}: ApiKeysSectionProps): React.ReactElement => {
  const { keys, pending, generate, roll, revoke } = useApiKeys(initialKeys);

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fadeInUp}>
        <KeysSection
          keys={keys}
          onGenerate={generate}
          generating={pending?.action === "generate"}
          onRoll={roll}
          onRevoke={revoke}
          rollingId={pending?.action === "roll" ? pending.id : null}
          revokingId={pending?.action === "revoke" ? pending.id : null}
        />
      </motion.div>
    </motion.div>
  );
};
