"use client";

import { Bell } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState } from "react";
import Ably from "ably/promises";
import Link from "next/link";
export const Notification = () => {
  const [notifications, setNotifications]: any = useState([]);
  var ably = new Ably.Realtime({
    key: "n-gD0A.W4KQCg:GyPm6YTLBQsr4KhgPj1dLCwr0eg4y7OVFrBuyztiiWg",
  });
  const channelAbly = ably.channels.get("course-publish");
  channelAbly.subscribe("course-publish", function (message: any) {
    const history = notifications.slice(-199);

    setNotifications([...history, message]);
    ably.close();
  });

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          {notifications.length != 0 ? (
            <div className="bg-red-600 rounded-full w-4 h-4 z-50 ml-3 absolute">
              {notifications.length}
            </div>
          ) : (
            <></>
          )}

          <Bell className="mt-1" size={28}></Bell>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <p className="font-bold text-lg mb-2">Notification</p>

            {notifications.length > 0 ? (
              notifications.map((notification: any, index: any) => (
                <Link
                  dangerouslySetInnerHTML={{
                    __html: notification.data.message,
                  }}
                  href={notification.data.link + ""}
                  key={index}
                ></Link>
              ))
            ) : (
              <p>No notification</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
