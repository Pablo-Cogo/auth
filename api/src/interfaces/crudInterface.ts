import { Request, Response } from "express";

export interface CrudInterface {
  create(req: Request, res: Response): Promise<void>;
  edit(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
  getAll(_: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
}
