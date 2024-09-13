/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const isArraysMatched = (arr1: any[], arr2: any[]) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  return (
    arr1.every((item) => arr2.includes(item)) &&
    arr2.every((item) => arr1.includes(item))
  );
};

export const debounce = (func: any, delay: number = 300) => {
  let timer: any;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
