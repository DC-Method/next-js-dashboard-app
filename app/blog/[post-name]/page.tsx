import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPost } from '@/app/lib/data';
import { join } from 'path';

export async function generateMetadata({ params }) {
  const post = await getPost(params['post-name']);

  let metaTitle = 'Blog post';
  let metaDesc = 'Example Blog post page';

  if('meta_title' in post) {
    metaTitle = post.meta_title;
  }

  if('meta_description' in post) {
    metaDesc = post.meta_description;
  }

  return {
    title: metaTitle,
    description: metaDesc,
  };
}

export default async function Page({ params }) {

  const post = await getPost(params['post-name']);

  if (!post) {
    notFound();
  }

  let metaTitle = 'Blog post';
  let metaDesc = 'Example Blog post page'
  let imagePath = '';


  if('meta_title' in post) {
    metaTitle = post.meta_title;
  }

  if('meta_description' in post) {
    metaDesc = post.meta_description;
  }

  if('header_image_url' in post) {
    imagePath = '/uploads/'+post.header_image_url
  }

  return (

    <main className="flex min-h-screen flex-col p-6">
    <p>Current pathname: {params['post-name']}</p>
    <div><strong>Post title:</strong> {post.post_title}</div>
    <div><strong>Meta title:</strong> {post.meta_title}</div>
    <div><strong>Meta description:</strong> {post.meta_description}</div>
    <div><strong>Author name:</strong> {post.name}</div>
    <div>
      <strong>Image:</strong>
    </div>
    <div>
        <Image
          src={imagePath}
          width={200}
          height={266}
          className="block"
          alt="For Jesus"
        />
    </div>
    </main>
  );
}