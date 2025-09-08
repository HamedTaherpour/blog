export default function SectionStatistic() {
  return (
    <div className="">
      <div className="mx-auto max-w-4xl lg:mx-0">
        <h2 className="text-3xl font-semibold tracking-tight text-pretty sm:text-4xl lg:text-5xl">
          Βλέπουμε την εργασία ως τρόπο να κάνουμε τον κόσμο καλύτερο
        </h2>
        <p className="mt-6 text-base/7 text-neutral-600 dark:text-neutral-400">
          Σήμερα περισσότερο από ποτέ, εστιάζουμε στη δημιουργία ουσιαστικής αξίας. Μαθαίνουμε, εξελισσόμαστε και
          συνεργαζόμαστε για να προσφέρουμε αποτελέσματα που έχουν αντίκτυπο.
        </p>
      </div>
      <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
          <p className="flex-none text-3xl font-bold tracking-tight text-gray-900">250k</p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight text-gray-900">Χρήστες στην πλατφόρμα</p>
            <p className="mt-2 text-base/7 text-gray-600">Χτίζουμε κοινότητα με εμπιστοσύνη και διαφάνεια.</p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44 dark:bg-neutral-800">
          <p className="flex-none text-3xl font-bold tracking-tight text-white">$8.9 billion</p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight text-white">
              Είμαστε περήφανοι που οι πελάτες μας έχουν δημιουργήσει πάνω από $8 δισ. σε συνολικά έσοδα.
            </p>
            <p className="mt-2 text-base/7 text-gray-400">
              Επικεντρωνόμαστε στην ανάπτυξη με υπευθυνότητα και βιωσιμότητα.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-primary-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
          <p className="flex-none text-3xl font-bold tracking-tight text-white">401,093</p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight text-white">Συναλλαγές φέτος</p>
            <p className="mt-2 text-base/7 text-indigo-200">
              Συνεχής πρόοδος, βελτίωση εμπειρίας και μετρήσιμα αποτελέσματα.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
