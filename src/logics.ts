import { Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";
import { IMovies, TMoviesRequest } from "./interface";
import { QueryConfig, QueryResult } from "pg";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
  const moviesData: TMoviesRequest = req.body;

  const queryString: string = format(
    `
          INSERT INTO movies(%I)
          VALUES(%L)
          RETURNING *;
        `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryResult: QueryResult<IMovies> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};
const listAllMovies = async (req: Request, res: Response): Promise<Response> => {
  const category = req.query.category;

  let queryString: string;
  let queryConfig: QueryConfig;
  
  if (category) {
    queryString = `
      SELECT * FROM movies
      WHERE category = $1;
    `;
    queryConfig = {
      text: queryString,
      values: [category],
    };
  } else {
    queryString = `
      SELECT * FROM movies;
    `;
    queryConfig = {
      text: queryString,
    };
  }
  
  let queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows);
};

const searchMovieId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const movies: IMovies = res.locals.movies;

  return res.status(200).json(movies);
};

const updateMovieId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const moviesData: Partial<TMoviesRequest> = req.body;

  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
          UPDATE movies
          SET(%I) = ROW(%L)
          WHERE id = $1
          RETURNING *;
        `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteMovieId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      DELETE FROM movies
      WHERE id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

export {
  createMovie,
  listAllMovies,
  searchMovieId,
  updateMovieId,
  deleteMovieId,
};
