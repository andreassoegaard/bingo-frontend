import {
  PropsWithChildren,
  Fragment,
  useState,
  useMemo,
  useEffect,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
  UsersIcon,
  PlayCircleIcon,
  BanknotesIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Link from "next/link";
import { selectOrgName, selectOrgState } from "@/store/orgSlice";
import { selectUserData, selectIsAdmin } from "@/store/userSlice";
import { useSelector } from "react-redux";
import supabase from "@/lib/supabase-browser";
import { useSlug } from "@/hooks/useSlug";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

interface Props {
  wrapperSize?: string;
}

export default function PlatformWrapper(props: PropsWithChildren<Props>) {
  const isAdmin = useSelector(selectIsAdmin);
  const orgState = useSelector(selectOrgState);
  const userData = useSelector(selectUserData);
  useEffect(() => {
    const checkOrgState = async () => {
      if (!orgState || orgState === 0 || !userData.id) {
        await supabase.auth.signOut();
      }
    };
    checkOrgState();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const orgName = useSelector(selectOrgName);

  const wrapperSize = useMemo(() => {
    if (props.wrapperSize) {
      return `bi-wrapper-size--${props.wrapperSize}`;
    } else {
      return "";
    }
  }, [props.wrapperSize]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      console.log(sessionData);
    };
    fetchSession();
  }, []);

  const router = useRouter();
  const slug = useSlug(router.asPath);

  const controlPanelItems = useMemo(() => {
    return [
      {
        name: "Brugere",
        href: `/platform/${slug}/control-panel/users`,
        icon: UsersIcon,
        current: router.asPath.includes(
          `/platform/${slug}/control-panel/users`
        ),
      },
      {
        name: "Indstillinger",
        href: `/platform/${slug}/control-panel/settings/general`,
        current: router.asPath.includes(
          `/platform/${slug}/control-panel/settings/`
        ),
        icon: Cog6ToothIcon,
      },
    ];
  }, [router.asPath, slug]);

  const navigation = useMemo(() => {
    return [
      {
        name: "Forside",
        href: `/platform/${slug}`,
        icon: HomeIcon,
        current: router.asPath === `/platform/${slug}`,
      },
      {
        name: "Statistik",
        href: `/platform/${slug}/statistics`,
        icon: ChartPieIcon,
        current: router.asPath === `/platform/${slug}/statistics`,
      },
      {
        name: "Bankospil",
        href: `/platform/${slug}/play/banko`,
        icon: PlayCircleIcon,
        current: router.asPath.includes(`/platform/${slug}/play/banko`),
      },
    ];
  }, [router.asPath, slug]);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-50 lg:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-900/80' />
            </Transition.Child>

            <div className='fixed inset-0 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute top-0 left-full flex w-16 justify-center pt-5'>
                      <button
                        type='button'
                        className='-m-2.5 p-2.5'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-2'>
                    <div className='flex h-16 shrink-0 items-center'>
                      <img
                        className='h-8 w-auto'
                        src='https://tailwindui.com/img/logos/mark.svg?color=white'
                        alt='Your Company'
                      />
                    </div>
                    <nav className='flex flex-1 flex-col'>
                      <ul role='list' className='flex flex-1 flex-col'>
                        <li>
                          <ul role='list' className='-mx-2 space-y-1'>
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-indigo-700 text-white"
                                      : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? "text-white"
                                        : "text-indigo-200 group-hover:text-white",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden='true'
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className='text-xs font-semibold leading-6 text-indigo-200'>
                            Kontrolpanel
                          </div>
                          <ul role='list' className='-mx-2 mt-2 space-y-1'>
                            {controlPanelItems.map((team) => (
                              <li key={team.name}>
                                <Link
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? "bg-indigo-700 text-white"
                                      : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <span className='truncate'>{team.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex grow flex-col overflow-y-auto bg-indigo-600 px-6'>
            <div className='mt-5 mb-6'>
              <div className='text-white text-sm font-semibold flex items-center'>
                <BanknotesIcon className='h-10 w-10 mr-3 pt-1 mt-0.5' />
                <div className='leading-5 pt-2'>
                  <div>BingoBuddy</div>
                  <div className='text-xs font-semibold text-indigo-200'>
                    {orgName}
                  </div>
                </div>
              </div>
            </div>

            <nav className='flex flex-1 flex-col'>
              <ul role='list' className='flex flex-1 flex-col'>
                <li>
                  <ul role='list' className='-mx-2 space-y-1'>
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-indigo-700 text-white"
                              : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-white"
                                : "text-indigo-200 group-hover:text-white",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden='true'
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className='mt-auto border-b border-indigo-500 pb-4 mb-3'>
                  <div className='text-xs font-semibold leading-6 text-indigo-200'>
                    Kontrolpanel
                  </div>
                  <ul role='list' className='-mx-2 mt-2 space-y-1'>
                    {controlPanelItems.map((team) => (
                      <li key={team.name}>
                        <Link
                          href={team.href}
                          className={classNames(
                            team.current
                              ? "bg-indigo-700 text-white"
                              : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <team.icon
                            className={classNames(
                              team.current
                                ? "text-white"
                                : "text-indigo-200 group-hover:text-white",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden='true'
                          />
                          {team.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className='-mx-6'>
                  <Link
                    href='/platform/user'
                    className={classNames(
                      router.route.includes("/platform/user")
                        ? "bg-indigo-700"
                        : "",
                      "flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-indigo-700"
                    )}
                  >
                    <img
                      className='h-8 w-8 rounded-full bg-indigo-700'
                      src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                      alt=''
                    />
                    <span className='sr-only'>Your profile</span>
                    {userData.name && (
                      <span aria-hidden='true'>{userData.name}</span>
                    )}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className='sticky top-0 z-40 flex items-center gap-x-6 bg-indigo-600 py-4 px-4 shadow-sm sm:px-6 lg:hidden'>
          <button
            type='button'
            className='-m-2.5 p-2.5 text-indigo-200 lg:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>
          <div className='flex-1 text-sm font-semibold leading-6 text-white'>
            Dashboard
          </div>
          <a href='#'>
            <span className='sr-only'>Your profile</span>
            <img
              className='h-8 w-8 rounded-full bg-indigo-700'
              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt=''
            />
          </a>
        </div>

        <main className='lg:pl-72'>
          <div className={wrapperSize}>
            <div className='px-12 mt-8'>{props.children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
