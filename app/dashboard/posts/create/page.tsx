import Form from '@/app/ui/posts/create-form';
import Breadcrumbs from '@/app/ui/posts/breadcrumbs';
import { fetchUsers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create post',
};
 
export default async function Page() {
  const users = await fetchUsers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Posts', href: '/dashboard/posts' },
          {
            label: 'Create Post',
            href: '/dashboard/posts/create',
            active: true,
          },
        ]}
      />
      <Form users={users} />
    </main>
  );
}