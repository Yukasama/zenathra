"use client";

import { createPortfolio } from "@/lib/portfolio-update";
import { useRouter } from "next/navigation";
import { Plus } from "react-feather";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button, Input, Checkbox } from "@/components/ui";

interface Props {
  numberOfPortfolios?: number;
  onClose?: any;
}

export default function PortfolioCreateModal({
  numberOfPortfolios = 0,
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [publicPortfolio, setPublicPortfolio] = useState(false);

  const router = useRouter();

  const handleClick = async () => {
    setTitle("");

    if (title.length < 1) return toast.error("Please choose a longer title.");
    if (title.length > 30) return toast.error("Please choose a shorter title.");
    if (numberOfPortfolios >= 3)
      return toast.error("Maximum number of portfolios reached.");

    const loading = toast.loading(`Creating Portfolio '${title}'...`);
    await createPortfolio(title, publicPortfolio)
      .then(() => {
        toast.success(`Portfolio '${title}' created.`, { id: loading });
      })
      .catch(() => {
        toast.error("Error creating Portfolio.", { id: loading });
      });

    onClose();
    router.refresh();
  };

  return (
    <>
      <Input
        id="createPortfolio"
        type="text"
        label="Choose your title..."
        heading="Portfolio Title"
        subheading="Give your portfolio a title"
        onChange={setTitle}
        focus
        required
      />
      <Checkbox
        className="ml-1"
        heading="Make public"
        label="Display portfolio publicly?"
        onChange={setPublicPortfolio}
      />
      <Button
        label="Create Portfolio"
        icon={<Plus className="h-[16px] w-[16px]" />}
        onClick={handleClick}
        color="blue"
      />
    </>
  );
}
