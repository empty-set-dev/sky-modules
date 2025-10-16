type InvertColorScale<T extends Record<number, string>> = {
    [K in keyof T]: T[K extends 50
        ? 950
        : K extends 100
          ? 900
          : K extends 200
            ? 800
            : K extends 300
              ? 700
              : K extends 400
                ? 600
                : K extends 500
                  ? 500
                  : K extends 600
                    ? 400
                    : K extends 700
                      ? 300
                      : K extends 800
                        ? 200
                        : K extends 900
                          ? 100
                          : K extends 950
                            ? 50
                            : never]
}

export default InvertColorScale

export type DeepInvertColorScale<T extends object> =
    T extends Record<number, string>
        ? InvertColorScale<T>
        : T extends Record<string, object>
          ? {
                [K in keyof T]: DeepInvertColorScale<T[K]>
            }
          : never
