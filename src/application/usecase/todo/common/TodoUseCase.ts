export interface TodoUseCase<Input, Output> {
  run(input: Input): Promise<Output>;
}
