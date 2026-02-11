const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class ItemId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  static generate(): ItemId {
    return new ItemId(crypto.randomUUID());
  }

  static reconstruct(value: string): ItemId {
    if (!UUID_V4_REGEX.test(value)) {
      throw new Error(`Invalid UUID: ${value}`);
    }
    return new ItemId(value);
  }
}
