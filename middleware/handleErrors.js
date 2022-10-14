const formatServerError = function (err) {
  return [
    {
      status: "500",
      title: "Server error",
      description: err?.message || "Please check the logs",
    },
  ];
};

const formatValidationError = function (errors) {
  return Object.values(errors).map((err) => ({
    status: "400",
    title: "Validation Error",
    description: err.message,
    source: { pointer: `/data/attributes/${err.path}`, value: err.value },
  }));
};

export default function handleErrors(err, req, res, next) {
  const isValidationError = err?.name === "ValidationError";
  const code = isValidationError ? 400 : err.code || 500;

  let payload = [err];

  if (code === 400) payload = formatValidationError(err.errors);

  if (code === 500) payload = formatServerError(err);
  
  res.status(code).send({ errors: payload });
}
