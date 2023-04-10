import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IMovies } from "./interface";
import { client } from "./database";

const existingNameCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const {name} = req.body;

  const queryString: string = `
        SELECT * FROM movies
        WHERE name = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  if (queryResult.rowCount !== 0) {
    return res.status(409).json({
      error: "Movie name already exists!",
    });
  }

  return next();
};

const checkIdExists  = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
        SELECT * FROM movies
        WHERE id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      error: "Movie not found!",
    });
  }

  res.locals.movies = queryResult.rows[0];

  return next();
};


export { existingNameCheck, checkIdExists };
