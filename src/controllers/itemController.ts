import { Request, Response } from 'express';
import { AppDataSource } from '../dataSource.js';
import { Item } from '../entities/itemEntity.js';
import { ItemSchema } from '../validators/itemValidator.js';

export const itemController = {
  // getInventory()
  //
  // literally just displays the raw json of every item in an inventory.
  async getInventory(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }

      const characterId = req.params.id;

      const repo = AppDataSource.getRepository(Item);

      const items = await repo.find({
        where: { character: { id: characterId } },
      });

      return res.status(200).json(items);
    } catch (err) {
      return res.status(404).json('Items not found.');
    }
  },
  // addItem()
  //
  // adds a single item to a character's inventory.
  async addItem(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }

      const characterId = req.params.id as string;

      const repo = AppDataSource.getRepository(Item);

      const parsed = ItemSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
      }

      const item = repo.create({
        character: { id: characterId },
        name: parsed.data.name,
        description: parsed.data.description,
      });

      const saved = await repo.save(item);

      return res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server error');
    }
  },
  // updateItem()
  //
  // changes the name or description of an item.
  async updateItem(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }

      const itemId = req.params.id as string;
      const parsed = ItemSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
      }

      const repo = AppDataSource.getRepository(Item);
      const item = await repo.findOne({
        where: { id: itemId },
      });

      if (!item) {
        return res.status(404).json('Item not found');
      }

      item.name = parsed.data.name;
      item.description = parsed.data.description;

      const updated = await repo.save(item);

      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server error');
    }
  },
  // deleteItem()
  //
  // deletes an item from an inventory.
  async deleteItem(req: Request, res: Response) {
    try {
      if (!req.session.authenticatedUser) {
        return res.status(401).json('Try logging in.');
      }

      const itemId = req.params.id as string;

      const repo = AppDataSource.getRepository(Item);

      const result = await repo.delete({ id: itemId });

      if (result.affected === 0) {
        return res.status(404).json('Item not found');
      }

      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server error');
    }
  },
};
