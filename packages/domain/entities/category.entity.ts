export class CategoryEntity {
  private constructor(public id: number, public name: string) {}

  public static from({ id, name }: { id: number; name: string }) {
    return new CategoryEntity(id, name);
  }
}
