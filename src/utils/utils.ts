export const getFileRoutes = () => {
  const files = import.meta.glob("../routes/manager/**/*.tsx", {
    eager: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routes: { path: string; element: React.ReactNode }[] = [];
  const keys = Object.keys(files);

  // run loop on keys array
  for (const key of keys) {
    const keyArr = key.split("../routes/manager/");
    const path = keyArr[1].split(".tsx")[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component: any = files[key];
    routes.push({ path, element: component?.default() });
  }

  return { admin: routes };
};
