'use client';

import { useFormState } from 'react-dom';
import { UserField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createPost } from '@/app/lib/actions';
import Image from "next/image";
import { ChangeEvent, MouseEvent, useState } from "react";

export default function Form({ users }: { users: UserField[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createPost, initialState);

  // const [file, setFile] = useState<File>();

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   if (!file) return

  //   try {
  //     const data = new FormData()
  //     data.set('file', file)

  //     const res = await fetch('/api/upload', {
  //       method: 'POST',
  //       body: data
  //     })

  //     // handle error
  //     if(!res.ok) throw new Error(await res.text())
  //   } catch (e: any) {
  //     console.error(e)
  //   }
  // }

  return (
    <form action={dispatch}>
    {/*<form onSubmit={onSubmit}>*/}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Post title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Enter a post title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter a post title"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="title-error"
              />
            </div>
            <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* slug */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Enter a slug
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="slug"
                name="slug"
                type="text"
                placeholder="Enter a slug"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="slug-error"
              />
            </div>
            <div id="slug-error" aria-live="polite" aria-atomic="true">
            {state.errors?.slug &&
              state.errors.slug.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Meta title */}
        <div className="mb-4">
          <label htmlFor="meta-title" className="mb-2 block text-sm font-medium">
            Enter a meta title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="meta-title"
                name="meta-title"
                type="text"
                placeholder="Enter a meta title"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="meta-title-error"
              />
            </div>
            <div id="meta-title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.metaTitle &&
              state.errors.metaTitle.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Meta description */}
        <div className="mb-4">
          <label htmlFor="meta-description" className="mb-2 block text-sm font-medium">
            Enter a meta description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="meta-description"
                name="meta-description"
                type="text"
                placeholder="Enter a meta description"
                className="peer block h-56 w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 resize-none"
                aria-describedby="meta-description-error"
              ></textarea>
            </div>
            <div id="meta-description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.metaDescription &&
              state.errors.metaDescription.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>


        {/* Image */}
        <div className="mb-4">
            <label className="flex flex-col h-full py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600">
              <strong className="text-sm font-medium">Select an image</strong>
              <input
                className="block w-0 h-0"
                name="file"
                type="file"
                // onChange={(e) => setFile(e.target.files?.[0])}
              />
            </label>
        </div>

        {/* Author */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Choose Author
          </legend>
          
          <div className="mb-4">

            <div className="relative">
              <select
                id="user"
                name="userId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="user-error"
              >
                <option value="" disabled>
                  Select an author
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="user-error" aria-live="polite" aria-atomic="true">
              {state.errors?.userId &&
                state.errors.userId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          
          <div id="general-errors" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/posts"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Post</Button>
      </div>
    </form>
  );
}
