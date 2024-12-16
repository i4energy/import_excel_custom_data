const names = [
  { en: "John Doe", el: "Τζον Ντο" },
  { en: "Alice Johnson", el: "Άλις Τζόνσον" },
  { en: "Michael Brown", el: "Μάικλ Μπράουν" },
  { en: "Jessica Smith", el: "Τζέσικα Σμιθ" },
  { en: "William Johnson", el: "Ουίλιαμ Τζόνσον" },
  { en: "Emma Wilson", el: "Έμμα Ουίλσον" },
  { en: "Olivia Martin", el: "Όλιβια Μάρτιν" },
  { en: "James Thomas", el: "Τζέιμς Θωμάς" },
  { en: "Isabella Jackson", el: "Ισαμπέλλα Τζάκσον" },
  { en: "Sophia Lopez", el: "Σοφία Λόπεζ" },
  { en: "Mason Davis", el: "Μέισον Ντέιβις" },
  { en: "Lucas White", el: "Λούκας Ουάιτ" },
  { en: "Mia Harris", el: "Μία Χάρρις" },
  { en: "Charlotte Clark", el: "Σαρλότ Κλαρκ" },
  { en: "Ethan Lewis", el: "Έθαν Λούις" },
  { en: "Alexander Walker", el: "Αλέξανδρος Ουόκερ" },
  { en: "Ava Hill", el: "Άβα Χιλ" },
  { en: "Noah Scott", el: "Νόα Σκοτ" },
  { en: "Liam Young", el: "Λίαμ Γιάνγκ" },
  { en: "Zoe Robinson", el: "Ζόι Ρόμπινσον" },
  { en: "Benjamin Carter", el: "Μπέντζαμιν Κάρτερ" },
  { en: "Natalie Moore", el: "Ναταλί Μουρ" },
  { en: "Dylan Murphy", el: "Ντύλαν Μέρφι" },
  { en: "Madison Perry", el: "Μάντισον Πέρι" },
  { en: "Lily Brooks", el: "Λίλι Μπρουκς" },
  { en: "Gabriel Allen", el: "Γκάμπριελ Άλεν" },
  { en: "Emily Sanchez", el: "Έμιλι Σάντσεζ" },
  { en: "Matthew Patel", el: "Ματθαίος Πατέλ" },
  { en: "Amelia Reynolds", el: "Αμέλια Ρέινολντς" },
  { en: "Evelyn Torres", el: "Έβελυν Τόρρες" },
];

const roles = [
  { en: "Senior Manager", el: "Ανώτερος Διευθυντής" },
  { en: "Project Lead", el: "Υπεύθυνος Έργου" },
  { en: "Technical Lead", el: "Τεχνικός Υπεύθυνος" },
  { en: "HR Manager", el: "Διευθυντής Προσωπικού" },
  { en: "Marketing Director", el: "Διευθυντής Μάρκετινγκ" },
  { en: "Operations Manager", el: "Διευθυντής Λειτουργιών" },
  { en: "IT Specialist", el: "Ειδικός Πληροφορικής" },
  { en: "Quality Assurance", el: "Ελεγκτής Ποιότητας" },
  { en: "Customer Service Manager", el: "Διευθυντής Εξυπηρέτησης Πελατών" },
  { en: "Chief Executive Officer", el: "Διευθύνων Σύμβουλος" },
  { en: "Chief Financial Officer", el: "Διευθυντής Οικονομικών" },
  { en: "Sales Manager", el: "Διευθυντής Πωλήσεων" },
  { en: "Product Manager", el: "Διευθυντής Προϊόντων" },
  { en: "Business Analyst", el: "Αναλυτής Επιχειρήσεων" },
  {
    en: "Research and Development Manager",
    el: "Διευθυντής Έρευνας και Ανάπτυξης",
  },
  { en: "Network Administrator", el: "Διαχειριστής Δικτύου" },
  { en: "Data Analyst", el: "Αναλυτής Δεδομένων" },
  { en: "Software Engineer", el: "Μηχανικός Λογισμικού" },
  { en: "User Experience Designer", el: "Σχεδιαστής Εμπειρίας Χρήστη" },
  { en: "Web Developer", el: "Αναπτυξιακός Προγραμματιστής" },
  { en: "Graphic Designer", el: "Γραφίστας" },
  { en: "Digital Marketing Specialist", el: "Ειδικός Ψηφιακού Μάρκετινγκ" },
  { en: "Compliance Officer", el: "Υπεύθυνος Συμμόρφωσης" },
  { en: "Logistics Coordinator", el: "Συντονιστής Λογιστικής" },
  { en: "Environmental Engineer", el: "Περιβαλλοντολόγος Μηχανικός" },
  { en: "Human Resources Consultant", el: "Σύμβουλος Ανθρώπινων Πόρων" },
  { en: "Public Relations Manager", el: "Διευθυντής Δημοσίων Σχέσεων" },
  { en: "Content Manager", el: "Διευθυντής Περιεχομένου" },
  { en: "Art Director", el: "Διευθυντής Τέχνης" },
  { en: "Supply Chain Manager", el: "Διευθυντής Εφοδιαστικής Αλυσίδας" },
];

const multiTexts = [
  { en: "Initial project proposal.", el: "Αρχική πρόταση έργου." },
  { en: "Secondary market analysis.", el: "Δευτερεύουσα ανάλυση αγοράς." },
  {
    en: "Technical requirements specification.",
    el: "Τεχνικές προδιαγραφές απαιτήσεων.",
  },
  { en: "Quarterly progress report.", el: "Τριμηνιαία έκθεση προόδου." },
  { en: "Annual financial summary.", el: "Ετήσια οικονομική περίληψη." },
  {
    en: "Customer satisfaction survey results.",
    el: "Αποτελέσματα έρευνας ικανοποίησης πελατών.",
  },
  {
    en: "New product development phases.",
    el: "Φάσεις ανάπτυξης νέων προϊόντων.",
  },
  { en: "Compliance audit findings.", el: "Ευρήματα ελέγχου συμμόρφωσης." },
  { en: "Risk management assessment.", el: "Αξιολόγηση διαχείρισης κινδύνων." },
  {
    en: "Employee training and development.",
    el: "Εκπαίδευση και ανάπτυξη εργαζομένων.",
  },
  {
    en: "Organizational change updates.",
    el: "Ενημερώσεις οργανωτικής αλλαγής.",
  },
  {
    en: "Marketing campaign strategies.",
    el: "Στρατηγικές καμπανιών μάρκετινγκ.",
  },
  {
    en: "Environmental sustainability initiatives.",
    el: "Πρωτοβουλίες περιβαλλοντικής βιωσιμότητας.",
  },
  {
    en: "Technological innovation updates.",
    el: "Ενημερώσεις τεχνολογικής καινοτομίας.",
  },
  {
    en: "New market expansion plans.",
    el: "Σχέδια για επέκταση σε νέες αγορές.",
  },
  {
    en: "Competitor analysis review.",
    el: "Ανασκόπηση ανάλυσης ανταγωνιστών.",
  },
  {
    en: "Corporate governance guidelines.",
    el: "Οδηγίες εταιρικής διακυβέρνησης.",
  },
  { en: "Project milestone achievements.", el: "Επιτεύγματα ορόσημων έργου." },
  {
    en: "Strategic partnership negotiations.",
    el: "Διαπραγματεύσεις στρατηγικής συνεργασίας.",
  },
  {
    en: "Product launch event planning.",
    el: "Σχεδιασμός εκδήλωσης λανσαρίσματος προϊόντος.",
  },
  {
    en: "Investor relations communication.",
    el: "Επικοινωνία σχέσεων επενδυτών.",
  },
  {
    en: "Corporate social responsibility report.",
    el: "Έκθεση εταιρικής κοινωνικής ευθύνης.",
  },
  {
    en: "Logistics optimization strategies.",
    el: "Στρατηγικές βελτιστοποίησης λογιστικής.",
  },
  {
    en: "Information security protocols.",
    el: "Πρωτόκολλα πληροφοριακής ασφάλειας.",
  },
  {
    en: "Digital transformation roadmap.",
    el: "Χάρτης πορείας ψηφιακής μεταμόρφωσης.",
  },
  {
    en: "Outsourcing contract negotiations.",
    el: "Διαπραγματεύσεις συμβολαίων outsourcing.",
  },
  {
    en: "Health and safety compliance.",
    el: "Συμμόρφωση με υγεία και ασφάλεια.",
  },
  { en: "Product recall procedures.", el: "Διαδικασίες ανάκλησης προϊόντος." },
  {
    en: "Budget review sessions.",
    el: "Συνεδριάσεις αναθεώρησης προϋπολογισμού.",
  },
  {
    en: "Employee performance evaluations.",
    el: "Αξιολογήσεις απόδοσης υπαλλήλων.",
  },
];

const texts = [
  "Sample text input",
  "Another sample text",
  "Final text example",
  "Quick brown fox jumps",
  "Lazy dog sleeps over",
  "High above the sky",
  "Deep below the ocean",
  "Far across the sea",
  "Close to the horizon",
  "Right around the corner",
  "Early morning dew",
  "Late night stars",
  "Quiet evening breeze",
  "Loud morning traffic",
  "Bright afternoon sun",
  "Clear midnight sky",
  "Gentle winter snowfall",
  "Heavy summer rain",
  "Mild spring weather",
  "Crisp autumn leaves",
  "Busy city streets",
  "Quiet suburban life",
  "Peaceful rural setting",
  "Bustling downtown district",
  "Serene woodland path",
  "Vibrant marketplace activity",
  "Calm library atmosphere",
  "Crowded festival excitement",
  "Tranquil beach sunset",
  "Stormy weather brewing",
];

const fileNames = [
  "report_final_version.pdf",
  "budget_2024.xlsx",
  "project_overview_presentation.ppt",
  "meeting_notes_12_15_2023.docx",
  "contract_agreement_signed.pdf",
  "photo_event_march.jpg",
  "logo_design_v3.svg",
  "employee_handbook_2023.pdf",
  "sales_data_q1.csv",
  "customer_feedback_compilation.txt",
];

const categories = [
  "category_1",
  "category_2",
  "category_3",
  "category_4",
  "category_5",
  "category_6",
  "category_7",
  "category_8",
  "category_9",
  "category_10",
];

const optionsNumber = ["Opt_1", "Opt_2", "Opt_3"];
const optionsText = ["Opt_a", "Opt_b", "Opt_c"];
const optionsBool = ["Opt_true", "Opt_false"];

function generateMockRows() {
  const data = [];

  for (let i = 0; i < 30; i++) {
    const randomDay = ("0" + (Math.floor(Math.random() * 28) + 1)).slice(-2);
    const randomMonth = ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2);
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = ("0" + Math.floor(Math.random() * 60)).slice(-2);

    // Generate random date for the current and next year for period fields
    const fromDate = `2024-${randomMonth}-${randomDay} ${randomHour}:${randomMinute}:00`;
    const toDate = `2025-${randomMonth}-${randomDay} ${randomHour}:${randomMinute}:00`;

    const entry = {
      "Name*": `EN: ${names[i % names.length].en}; EL: ${
        names[i % names.length].el
      }`,
      "Description*": `EN: ${roles[i % roles.length].en}; EL: ${
        roles[i % roles.length].el
      }`,
      "Category*": categories[i % categories.length],
      Multi_Text_1: `EN: ${multiTexts[i % multiTexts.length].en}; EL: ${
        multiTexts[i % multiTexts.length].el
      }`,
      Multi_Text_2: `EN: ${multiTexts[(i + 10) % multiTexts.length].en}; EL: ${
        multiTexts[(i + 10) % multiTexts.length].el
      }`,
      Multi_Text_3: `EN: ${multiTexts[(i + 20) % multiTexts.length].en}; EL: ${
        multiTexts[(i + 20) % multiTexts.length].el
      }`,
      Text_1: texts[i % texts.length],
      Text_2: texts[(i + 10) % texts.length],
      Text_3: texts[(i + 20) % texts.length],
      Number_1: Math.floor(Math.random() * 100 + 100),
      Number_2: Math.floor(Math.random() * 100 + 200),
      Number_3: parseFloat((Math.random() * 100 + 50).toFixed(1)),
      Measurement_1: `${Math.floor(Math.random() * 1000) + 500} kW`,
      Measurement_3: `${Math.floor(Math.random() * 200) + 100} kW/h`,
      Measurement_2: `${Math.floor(Math.random() * 1500) + 500} kW/h`,
      Select_Number_1: optionsNumber[i % optionsNumber.length],
      Select_Text_1: optionsText[i % optionsText.length],
      Select_Bool_1: optionsBool[i % optionsBool.length],
      Single_date_1: fromDate,
      Period_date_1: `FROM: ${fromDate}; TO: ${toDate}`,
      Map_1: `LAT: ${Math.floor(Math.random() * 180) - 90}.${Math.floor(
        Math.random() * 10000
      )}; LNG: ${Math.floor(Math.random() * 360) - 180}.${Math.floor(
        Math.random() * 10000
      )}`,
      File_1: `/path/to/${fileNames[i % fileNames.length]}`,
    };
    data.push(entry);
  }

  return data;
}

module.exports = {
  generateMockRows,
};
