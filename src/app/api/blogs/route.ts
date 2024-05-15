import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(3),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const page = Number(req.query.page) || 1;
      const pagesize = 10;
      const skip = (page - 1) * pagesize;
      const search = req.query.search || "";

      const blogs = await prisma.blog.findMany({
        skip: skip,
        take: pagesize,
        where: {
          title: {
            contains: search,
          },
        },
      });

      const total = await prisma.blog.count();
      const totalPages = Math.ceil(total / pagesize);

      const response = {
        data: blogs,
        meta: {
          page,
          totalPages,
          totalResults: total,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Error fetching blogs" });
    }
  } else if (req.method === "POST") {
    try {
      const parsedBody = blogSchema.parse(req.body);

      const blog = await prisma.blog.create({
        data: {
          title: parsedBody.title,
          content: parsedBody.content,
        },
      });

      res.status(201).json(blog);
    } catch (error) {
      res.status(500).json({ error: "Error creating blog" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export { handler as GET, handler as POST };
