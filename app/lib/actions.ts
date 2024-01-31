'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as dateFn from 'date-fns';
import mime from 'mime';
import { PostsForm, PostMetaForm, latestPost } from './definitions';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const PostFormSchema = z.object({
  id: z.string(),
  title: z.string({
    invalid_type_error: 'Please enter a post title.',
  }),
  slug: z.string({
    invalid_type_error: 'Please enter a slug.',
  }),
  metaTitle: z.string({
    invalid_type_error: 'Please enter a meta title.',
  }),
  metaDescription: z.string({
    invalid_type_error: 'Please enter a meta description.',
  }),
  userId: z.string({
    invalid_type_error: 'Please select a user.',
  }),
  headerImage: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreatePost = PostFormSchema.omit({ id: true, headerImage: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod

	const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
	});

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
	
	try {
    await sql`
  		INSERT INTO invoices (customer_id, amount, status, date) 
  		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices');
	// Test it out:
	// console.log(typeof rawFormData.amount);
}

export async function updateInvoice(
  id: string, 
  prevState: State, 
  formData: FormData,
  ) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
    	UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}`;
  } catch (error) {
    return { 
      message: 'Database Error: Failed to Update Invoice.' 
    };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw error on purpose to trigger error handling
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { 
      message: 'Deleted Invoice.' 
    };
  } catch (error) {
    return { 
      message: 'Database Error: Failed to Delete Invoice.' 
    };
  }
}

export async function latestPostId(title: string) {

  const postTitle = title;
  // selecting latest post id
  try {
    const latestPostId = await sql<PostsForm>`
      SELECT id from posts 
      WHERE name = ${postTitle}`;

    const id = latestPostId.rows.map((id) => ({
      ...id,
    }));
    // console.log(id[0]);
    return id[0];
  } catch (error) {
    return {
      message: 'Database Error: Failed to Select Post.',
    };
  }
}

export async function createPost(prevState: State, formData: FormData) {
  
  const fileHandler: File | null = formData.get('file') as unknown as File

  if(!fileHandler) {
    throw new Error('No file uploaded')
  }

  const bytes = await fileHandler.arrayBuffer()
  const buffer = Buffer.from(bytes)
  // console.log(fileHandler)

  try {
    const path = join(process.env.ROOT_DIR || process.cwd(), '/public/uploads/', fileHandler.name)
    await writeFile(path, buffer)
    // console.log('open ${path} to see the uploaded file')
  } catch (e: any) {
    console.error(e);
    return {
      message: 'Upload error: Failed to upload file.',
    };
  }

  // Validate form fields using Zod

  const validatedFields = CreatePost.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    metaTitle: formData.get('meta-title'),
    metaDescription: formData.get('meta-description'),
    userId: formData.get('userId'),
  });

  // console.log(validatedFields)

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Post.',
    };
  }

  // Prepare data for insertion into the database
  const { title, userId, slug, metaTitle, metaDescription } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  
  try {
    await sql`
      INSERT INTO posts (name, user_id, slug, date_created) 
      VALUES (${title}, ${userId}, ${slug}, ${date})`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Post.',
    };
  }

  // to do: set lpID.id as string in latestPostId return id[0] function

  let lpId = {};
  lpId = await latestPostId(title);
  // console.log(lpId.id);

  try {
    await sql<PostMetaForm>`
      INSERT INTO post_meta (post_id, post_title, meta_title, meta_description, header_image_url)  
      VALUES (${lpId.id}, ${title}, ${metaTitle}, ${metaDescription}, ${fileHandler.name})`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Post Meta.',
    };
  }

  revalidatePath('/dashboard/posts');
  redirect('/dashboard/posts');
}

export async function deletePost(id: string) {
  // throw error on purpose to trigger error handling
  // throw new Error('Failed to Delete Invoice');
  // console.log(id);
  try {
    await sql`DELETE
      FROM posts a  
      WHERE a.id = ${id}`;
  } catch (error) {
    return { 
      message: 'Database Error: Failed to Delete Post.' 
    };
  }

  try {
    await sql`DELETE
      FROM post_meta a  
      WHERE a.post_id = ${id}`;
  } catch (error) {
    return { 
      message: 'Database Error: Failed to Delete Post Meta.' 
    };
  }

  revalidatePath('/dashboard/posts');
  redirect('/dashboard/posts');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}