export const setJson = ({
  code,
  message,
  data,
}: {
  code?: number;
  message?: string;
  data?: any;
}) => {
  return {
    code: code ?? 0,
    message: message ?? "ok",
    data: data ?? null,
  };
};
