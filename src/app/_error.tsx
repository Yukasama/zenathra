interface Props {
  statusCode?: number;
}

export const runtime = "edge";

export default function Error({ statusCode = 404 }: Props) {
  return (
    <div className="f-box mt-[360px]">
      <div className="f-col gap-2.5">
        <h2 className="text-zinc-600 dark:text-zinc-400 text-lg">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </h2>
      </div>
    </div>
  );
}
