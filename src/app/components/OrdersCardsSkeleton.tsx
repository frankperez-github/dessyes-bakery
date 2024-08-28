import { IconCalendarEvent, IconChevronDown, IconChevronUp, IconCoin, IconCreditCard, IconMap2, IconMoneybag, IconReceipt } from "@tabler/icons-react";
import clsx from 'clsx';

export default function OrdersCardSkeletons() {

    return (
        <div className={clsx("w-10/12 mx-auto border-2 flex flex-col gap-4 rounded-md p-6 my-10 animate-pulse", `border-gray-200`)}>
            <div className="flex">
                <IconCalendarEvent className="mr-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex">
                <div className="max-w-[8%] lg:max-w-[2%] xl:max-w-[2%] mr-2">
                    <IconMap2 size={"100%"} className="mr-2" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex">
                <IconCreditCard className="mr-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex">
                <IconMoneybag className="mr-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex">
                <IconCoin className="mr-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <p className="font-bold">
                <div className="flex">
                    <IconReceipt className="mr-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </p>
            
            <div className="w-full my-2 justify-center border-2 rounded-lg bg-gray-200 p-2 ml-auto flex gap-3">
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
        </div>
    );
}
