"use client";

import { Bell } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState } from "react";
import { useChannel } from "ably/react";
import Link from "next/link";
export const Notification = () => {
  const [notifications, setNotifications]: any = useState([]);
  const { channel, ably } = useChannel("course:sendCourse", (message: any) => {
    const history = notifications.slice(-199);

    if (message.data.type == "course-publish") {
      setNotifications([...history, message]);
    }
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
