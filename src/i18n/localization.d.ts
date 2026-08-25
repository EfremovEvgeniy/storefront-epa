// `export {}` makes this a module so `declare module` augments instead of replacing.
export {};

type AppMessages = (typeof import("./messages").custom)["en"];

declare module "@uscreentv/localization" {
  // Declaration merging, as @uscreentv/localization documents it.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomMessages extends AppMessages {}
}
