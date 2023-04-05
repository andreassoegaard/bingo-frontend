import { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import { useSlug } from "@/hooks/useSlug";
import Link from "next/link";

export default function SettingsWrapper(props: PropsWithChildren) {
  const router = useRouter();
  const slug = useSlug(router.asPath);
  const navigation = [
    {
      name: "Generelt",
      href: `/platform/${slug}/control-panel/settings/general`,
      current:
        router.asPath === `/platform/${slug}/control-panel/settings/general`,
    },
  ];

  const bankoNavigation = [
    {
      name: "Standardopsætning",
      href: `/platform/${slug}/control-panel/settings/bankosetup`,
      current:
        router.asPath === `/platform/${slug}/control-panel/settings/bankosetup`,
    },
    {
      name: "Bankoplader",
      href: `/platform/${slug}/control-panel/settings/bankoplates`,
      current:
        router.asPath ===
        `/platform/${slug}/control-panel/settings/bankoplates`,
    },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className='flex flex-wrap'>
      <div className='w-full lg:w-4/12'>
        <nav className='space-y-1' aria-label='Sidebar'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                "flex items-center rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <span className='truncate'>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className='font-medium text-xs text-gray-500 mt-6 mb-2'>
          Bankospil
        </div>
        <nav className='space-y-1' aria-label='Sidebar'>
          {bankoNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                "flex items-center rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <span className='truncate'>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className='w-full lg:w-8/12 pl-12'>{props.children}</div>
    </div>
  );
}
