import React, { useState } from "react";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* زر فتح الشات */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="
            bg-siteText 
            text-siteBg 
            px-5 py-2 
            rounded-full 
            shadow-lg 
            flex items-center space-x-2 
            font-medium
          "
        >
          <span>💬</span>
          <span>Chat</span>
        </button>
      </div>

      {/* مربع الشات */}
      {open && (
        <div
          className="
            fixed bottom-24 right-4 
            w-80 
            rounded-lg 
            shadow-2xl 
            border border-siteBorder 
            bg-siteBg 
            z-50
          "
        >
          {/* الهيدر */}
          <div
            className="
              bg-siteBg 
              text-siteText 
              px-4 py-3 
              rounded-t-lg 
              flex justify-between items-center 
              border-b border-siteBorder 
              font-semibold
            "
          >
            <span>Chat with us</span>
            <button onClick={() => setOpen(false)} className="text-siteText">
              ✖
            </button>
          </div>

          {/* المحتوى */}
          <div className="p-4">
            <p className="text-sm mb-4 text-siteText">
              👋 Hi, message us with any questions.
              <br />
              We're happy to help!
            </p>

            <form
              action="https://formsubmit.co/el/yipuzi"
              method="POST"
              className="space-y-4"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input
                type="hidden"
                name="_subject"
                value="New Chat Message from Fragrance Website"
              />

              {/* الاسم */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-siteText">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="
                    w-full p-2 
                    border border-siteBorder 
                    rounded 
                    bg-siteLight 
                    text-siteText
                  "
                  placeholder="Your name"
                />
              </div>

              {/* الرسالة */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-siteText">
                  Write your message
                </label>
                <textarea
                  name="message"
                  required
                  className="
                    w-full p-2 
                    border border-siteBorder 
                    rounded 
                    bg-siteLight 
                    text-siteText
                  "
                  placeholder="Write your message"
                />
              </div>

              {/* زر الإرسال */}
              <button
                type="submit"
                className="
                  w-full 
                  py-2 
                  rounded 
                  bg-siteText 
                  text-siteBg 
                  font-semibold 
                  hover:opacity-80 
                  transition
                "
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
