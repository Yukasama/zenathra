"use client";

interface Props {
  statusCode: number | undefined;
}

export const runtime = "edge";

export default function Error({ statusCode }: Props) {
  return (
    <div className="f-box mt-[360px]">
      <div className="f-col gap-2.5">
        <h2 className="text-zinc-600 dark:text-zinc-400 text-lg">
          {statusCode
            ? `An error ${statusCode ?? 404} occurred on server`
            : "An error occurred on client"}
        </h2>
      </div>
    </div>
  );
}
