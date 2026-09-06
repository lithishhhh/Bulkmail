import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

function BulkMail() {

  const [subject, setSubject] = useState("");
  const [msg, setmsg] = useState("");
  const [emailList, setemailList] = useState([]);
  const [status, setstatus] = useState(false);

  // Activity
  const [totalActivity, setTotalActivity] = useState(0);
  const [successfulActivity, setSuccessfulActivity] = useState(0);


  function handlemsg(evt) {
    setmsg(evt.target.value);
  }


  function Send() {

    // Basic validation
    if (!subject.trim()) {
      alert("Please enter email subject");
      return;
    }

    if (!msg.trim()) {
      alert("Please enter your message");
      return;
    }

    if (emailList.length === 0) {
      alert("Please upload recipient emails");
      return;
    }

    setstatus(true);

    axios
      .post(`${process.env.REACT_APP_API_URL}/sendemail`, {
        subject: subject,
        msg: msg,
        emailList: emailList
      })
      .then(function (data) {

        // One campaign attempted
        setTotalActivity((prev) => prev + 1);

        if (data.data === true) {

          alert("Email sent successfully");

          // One successful campaign
          setSuccessfulActivity((prev) => prev + 1);

          setstatus(false);
          setSubject("");
          setmsg("");
        }
        else {

          alert("Failed to send email");

          setstatus(false);
        }

      })
      .catch(function (error) {

        console.log(error);

        setTotalActivity((prev) => prev + 1);

        alert("Something went wrong while sending email");

        setstatus(false);
      });
  }


  function handleFile(event) {

    const file = event.target.files[0];

    if (!file) return;

    console.log("Selected file:", file);

    const reader = new FileReader();

    reader.onload = (evt) => {

      const data = evt.target.result;

      const workbook = XLSX.read(data, {
        type: "binary"
      });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      console.log("Worksheet:", worksheet);

      const emailData = XLSX.utils.sheet_to_json(
        worksheet,
        {
          header: "A"
        }
      );

      console.log("Email List:", emailData);

      const totalemail = emailData
        .map((item) => item.A)
        .filter((email) => email);

      setemailList(totalemail);

      console.log(totalemail);
      console.log(totalemail.length);
    };

    reader.readAsBinaryString(file);
  }


  return (

    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ================= HEADER ================= */}

      <header className="pt-10 sm:pt-14 pb-8 sm:pb-10 text-center px-4">

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[0.18em]">
          BulkMail
        </h1>

        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-400 tracking-[0.08em]">
          Send multiple emails. Simply. Efficiently.
        </p>

      </header>


      {/* ================= MAIN ================= */}

      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 flex-1">


        {/* ================= OPENING HEADING ================= */}

        <section className="mb-8 sm:mb-10">

          <h2 className="text-2xl sm:text-3xl font-medium tracking-wide">
            Reach your audience.
          </h2>

          <p className="mt-2 text-sm sm:text-base text-zinc-500">
            Create your campaign and send it to your recipients.
          </p>

        </section>


        {/* ================= ACTIVITY ================= */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">


          {/* Total Activity */}

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-5">

            <p className="text-[10px] sm:text-xs text-zinc-500 tracking-[0.15em] uppercase">
              Total Activity
            </p>

            <p className="mt-3 text-2xl sm:text-3xl font-semibold">
              {totalActivity}
            </p>

          </div>


          {/* Successful Activity */}

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-5">

            <p className="text-[10px] sm:text-xs text-zinc-500 tracking-[0.15em] uppercase">
              Successful Activity
            </p>

            <p className="mt-3 text-2xl sm:text-3xl font-semibold text-[#D4AF37]">
              {successfulActivity}
            </p>

          </div>

        </div>


        {/* ================= EMAIL SUBJECT ================= */}

        <div className="mb-8">

          <label className="block mb-3 text-xs font-medium text-[#D4AF37] tracking-[0.25em]">
            EMAIL SUBJECT
          </label>

          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-5
              py-4
              text-sm
              text-white
              placeholder:text-zinc-600
              tracking-wide
              outline-none
              focus:border-[#D4AF37]
              transition
            "
          />

        </div>


        {/* ================= MESSAGE ================= */}

        <div className="mb-10">

          <label className="block mb-3 text-xs font-medium text-[#D4AF37] tracking-[0.25em]">
            MESSAGE
          </label>

          <textarea
            value={msg}
            onChange={handlemsg}
            placeholder="Write your message..."
            className="
              w-full
              h-48
              sm:h-52
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              p-5
              text-sm
              text-white
              placeholder:text-zinc-600
              tracking-wide
              resize-none
              outline-none
              focus:border-[#D4AF37]
              transition
            "
          />

        </div>


        {/* ================= FILE UPLOAD ================= */}

        <div className="mb-8">

          <label className="block mb-3 text-xs font-medium text-[#D4AF37] tracking-[0.25em]">
            RECIPIENTS
          </label>

          <label
            htmlFor="fileInput"
            className="
              group
              w-full
              min-h-28
              sm:min-h-32
              border
              border-dashed
              border-zinc-700
              rounded-xl
              bg-zinc-950
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              hover:border-[#D4AF37]
              transition
              px-4
            "
          >

            <span className="text-sm text-zinc-400 text-center mb-5">
              Choose your recipient file
            </span>

            <span className="mt-2 text-xs text-zinc-600">

            </span>
                      <input
            id="fileInput"
            type="file"
            onChange={handleFile}
            className="
    mx-auto
    block
    text-sm
    text-zinc-400
    file:mr-4
    file:px-5
    file:py-2
    file:rounded-md
    file:border
    file:border-[#D4AF37]
    file:bg-[#D4AF37]
    file:text-black
    file:font-medium
    file:cursor-pointer
    hover:file:bg-[#E5C45A]
  "
          />


          </label>




        </div>


        {/* ================= EMAIL COUNT ================= */}

        <div className="flex items-center justify-between py-5 border-y border-zinc-900">

          <span className="text-xs text-zinc-500 tracking-[0.15em] uppercase">
            Total Recipients
          </span>

          <span className="text-lg font-medium text-[#D4AF37]">
            {emailList.length}
          </span>

        </div>


        {/* ================= SEND BUTTON ================= */}

        <div className="flex justify-center mt-10 mb-16">

          <button
            onClick={Send}
            disabled={status}
            className="
              w-full
              sm:w-auto
              px-10
              py-3.5
              bg-[#D4AF37]
              text-black
              rounded-md
              text-sm
              font-semibold
              tracking-[0.12em]
              uppercase
              hover:bg-[#E5C45A]
              active:scale-95
              disabled:opacity-50
              transition
            "
          >
            {status ? "Sending..." : "Send Emails"}
          </button>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="pb-8 text-center">

        <p className="text-[10px] text-zinc-700 tracking-[0.35em]">
          BULKMAIL
        </p>

      </footer>

    </div>
  );
}

export default BulkMail;