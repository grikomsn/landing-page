import * as React from "react";

import { Box, Divider, Stack } from "@chakra-ui/core";

import { BlogPost } from "@/types";
import { Link } from ".";
import { formatDate } from "@/utils";
import { useColorMode } from "@/hooks";

type BlogPostsProps = {
  blogPosts: BlogPost[];
  slice?: number;
};

const BlogPosts: React.FC<BlogPostsProps> = ({ blogPosts, slice }) => {
  const { isDarkMode } = useColorMode();

  const sliced = slice > 0 ? blogPosts.slice(0, slice) : blogPosts;

  return (
    <Box>
      {sliced.map(({ title, slug, subtitle, postedAt }, i) => (
        <React.Fragment key={slug}>
          {i > 0 && (
            <Box py={2}>
              <Divider />
            </Box>
          )}

          <Box>
            <Stack flexDirection={{ default: "column", lg: "row" }}>
              <Box width={{ lg: 2 / 5 }} fontWeight="semibold">
                <Link
                  isNextLink
                  href="/blog/[slug]"
                  linkAs={`/blog/${slug}`}
                  fontSize={{ default: "lg", lg: "md" }}
                >
                  {title}
                </Link>
              </Box>

              <Box
                fontSize="sm"
                px={{ default: 0, lg: 4 }}
                width={{ lg: 2 / 5 }}
              >
                {subtitle}
              </Box>

              <Box
                fontSize="sm"
                color={isDarkMode ? "gray.400" : "gray.500"}
                width={{ default: null, lg: 1 / 5 }}
                textAlign={{ default: "initial", lg: "right" }}
              >
                <Box display={{ default: "inline", lg: "none" }}>
                  Posted on{" "}
                </Box>
                {formatDate(postedAt)}
              </Box>
            </Stack>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};

BlogPosts.defaultProps = {
  slice: 0,
};

export default BlogPosts;
