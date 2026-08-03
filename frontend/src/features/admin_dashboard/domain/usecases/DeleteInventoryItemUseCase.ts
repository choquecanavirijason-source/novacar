/**
 * Domain · Use Case · DeleteInventoryItem
 */

import type { AdminRepository } from "../repositories/AdminRepository";

export class DeleteInventoryItemUseCase {
  constructor(private readonly repository: AdminRepository) {}

  execute(itemId: string): Promise<void> {
    return this.repository.deleteInventoryItem(itemId);
  }
}
