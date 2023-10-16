export {}

declare global {
    type Intersection<
        T1 = never,
        T2 = never,
        T3 = never,
        T4 = never,
        T5 = never,
        T6 = never,
        T7 = never,
        T8 = never,
        T9 = never,
        T10 = never,
        T11 = never,
        T12 = never,
        T13 = never,
        T14 = never,
        T15 = never,
        T16 = never
    > = T1 extends never
        ? never
        : T2 extends never
        ? { new (): T1 }
        : T3 extends never
        ? { new (): T1 & T2 }
        : T4 extends never
        ? { new (): T1 & T2 & T3 }
        : T5 extends never
        ? { new (): T1 & T2 & T3 & T4 }
        : T6 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 }
        : T7 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 }
        : T8 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 }
        : T9 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 }
        : T10 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 }
        : T11 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 }
        : T12 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 }
        : T13 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 }
        : T14 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 }
        : T15 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 }
        : T16 extends never
        ? { new (): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 }
        : {
              new (): T1 &
                  T2 &
                  T3 &
                  T4 &
                  T5 &
                  T6 &
                  T7 &
                  T8 &
                  T9 &
                  T10 &
                  T11 &
                  T12 &
                  T13 &
                  T14 &
                  T15 &
                  T16
          }
}
