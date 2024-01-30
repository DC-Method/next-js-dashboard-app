import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { getPost } from '@/app/lib/data';

// export async function getMetaData({ params }) {
//   const post = await getPost(params['post-name']);

//   let metaTitle = 'Blog post';
//   let metaDesc = 'Example Blog post page';

//   if('meta_title' in post) {
//     metaTitle = post.meta_title;
//   }

//   if('meta_description' in post) {
//     metaDesc = post.meta_description;
//   }

//   return metaTitle, metaDesc;
// }

// const finalMetaData = getMetaData();

// export const metadata: Metadata = {
//   title: finalMetaData.metaTitle,
//   description: finalMetaData.metaDesc,
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
