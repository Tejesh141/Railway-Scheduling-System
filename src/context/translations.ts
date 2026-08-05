export type Language = 'English' | 'Hindi' | 'Tamil';

export const translations: Record<Language, Record<string, string>> = {
  English: {
    // Nav
    dashboard: 'Control Dashboard',
    liveMap: 'Live Train Map',
    conflicts: 'Conflict Predictions',
    recommendations: 'AI Recommendations',
    simulation: 'What-if Simulation',
    analytics: 'Section Analytics',
    logs: 'System Logs',
    settings: 'Settings',

    // Dashboard
    dashboardTitle: 'Control Dashboard',
    dashboardSubtitle: 'Real-time railway traffic monitoring and optimization',
    liveTrainStatus: 'Live Train Status',
    trainsInSection: 'trains in section',
    predictedConflicts: 'Predicted Conflict Alerts',
    potentialConflicts: 'potential conflicts detected',
    aiRecommended: 'AI Recommended Actions',
    optimizationSuggestions: 'optimization suggestions',
    throughputMetrics: 'Section Throughput Metrics',
    realTimePerformance: 'Real-time performance indicators',

    // Table headers
    trainId: 'Train ID',
    trainName: 'Train Name',
    type: 'Type',
    currentStation: 'Current Station',
    nextStation: 'Next Station',
    delay: 'Delay',
    priority: 'Priority',
    status: 'Status',

    // Actions
    accept: 'Accept',
    override: 'Override',
    autoResolve: 'Auto-Resolve',
    viewDetails: 'View Details',
    save: 'Save Settings',
    reset: 'Reset to Default',
    saving: 'Saving...',
    savedSuccess: '✓ Settings saved to database',

    // Settings sections
    general: 'General',
    aiEngine: 'AI Engine',
    trainTrack: 'Train & Track',
    notifications: 'Notifications',
    display: 'Display',
    security: 'Security',
    operatorProfile: 'Operator Profile',
    system: 'System',

    // Settings labels
    sectionName: 'Section / Corridor Name',
    timezone: 'Timezone',
    language: 'Language',
    dateFormat: 'Date Format',
    gpsRefresh: 'GPS Data Refresh Interval (seconds)',
    connectedDb: 'Connected to DB',
    notConnected: 'Not connected',
    loadingSettings: 'Loading settings from database...',

    // Metrics
    averageDelay: 'Average Delay',
    trainsPerHour: 'Trains Per Hour',
    trackUtilization: 'Track Utilization',
    onTimePerformance: 'On-Time Performance',
    hourlyThroughput: 'Hourly Throughput',
    delayDistribution: 'Delay Distribution',
    onTime: 'On Time',

    // Status
    running: 'Running',
    waiting: 'Waiting',
    crossing: 'Crossing',
    liveFromSupabase: 'Live from Supabase',
    mockData: 'Mock data',
  },

  Hindi: {
    // Nav
    dashboard: 'नियंत्रण डैशबोर्ड',
    liveMap: 'लाइव ट्रेन मानचित्र',
    conflicts: 'संघर्ष पूर्वानुमान',
    recommendations: 'AI सिफारिशें',
    simulation: 'क्या-अगर सिमुलेशन',
    analytics: 'सेक्शन विश्लेषण',
    logs: 'सिस्टम लॉग',
    settings: 'सेटिंग्स',

    // Dashboard
    dashboardTitle: 'नियंत्रण डैशबोर्ड',
    dashboardSubtitle: 'रियल-टाइम रेलवे ट्रैफिक निगरानी और अनुकूलन',
    liveTrainStatus: 'लाइव ट्रेन स्थिति',
    trainsInSection: 'सेक्शन में ट्रेनें',
    predictedConflicts: 'संघर्ष अलर्ट',
    potentialConflicts: 'संभावित संघर्ष पाए गए',
    aiRecommended: 'AI अनुशंसित कार्रवाई',
    optimizationSuggestions: 'अनुकूलन सुझाव',
    throughputMetrics: 'सेक्शन थ्रूपुट मेट्रिक्स',
    realTimePerformance: 'रियल-टाइम प्रदर्शन संकेतक',

    // Table headers
    trainId: 'ट्रेन ID',
    trainName: 'ट्रेन का नाम',
    type: 'प्रकार',
    currentStation: 'वर्तमान स्टेशन',
    nextStation: 'अगला स्टेशन',
    delay: 'देरी',
    priority: 'प्राथमिकता',
    status: 'स्थिति',

    // Actions
    accept: 'स्वीकार करें',
    override: 'ओवरराइड',
    autoResolve: 'स्वतः हल करें',
    viewDetails: 'विवरण देखें',
    save: 'सेटिंग्स सहेजें',
    reset: 'डिफ़ॉल्ट पर रीसेट करें',
    saving: 'सहेज रहे हैं...',
    savedSuccess: '✓ डेटाबेस में सहेजा गया',

    // Settings sections
    general: 'सामान्य',
    aiEngine: 'AI इंजन',
    trainTrack: 'ट्रेन और ट्रैक',
    notifications: 'सूचनाएं',
    display: 'प्रदर्शन',
    security: 'सुरक्षा',
    operatorProfile: 'ऑपरेटर प्रोफ़ाइल',
    system: 'सिस्टम',

    // Settings labels
    sectionName: 'सेक्शन / कॉरिडोर नाम',
    timezone: 'समय क्षेत्र',
    language: 'भाषा',
    dateFormat: 'दिनांक प्रारूप',
    gpsRefresh: 'GPS डेटा रिफ्रेश अंतराल (सेकंड)',
    connectedDb: 'DB से जुड़ा है',
    notConnected: 'जुड़ा नहीं है',
    loadingSettings: 'डेटाबेस से सेटिंग्स लोड हो रही हैं...',

    // Metrics
    averageDelay: 'औसत देरी',
    trainsPerHour: 'प्रति घंटे ट्रेनें',
    trackUtilization: 'ट्रैक उपयोग',
    onTimePerformance: 'समय पर प्रदर्शन',
    hourlyThroughput: 'प्रति घंटे थ्रूपुट',
    delayDistribution: 'देरी वितरण',
    onTime: 'समय पर',

    // Status
    running: 'चल रही है',
    waiting: 'प्रतीक्षारत',
    crossing: 'क्रॉसिंग',
    liveFromSupabase: 'Supabase से लाइव',
    mockData: 'मॉक डेटा',
  },

  Tamil: {
    // Nav
    dashboard: 'கட்டுப்பாட்டு டாஷ்போர்டு',
    liveMap: 'நேரடி ரயில் வரைபடம்',
    conflicts: 'மோதல் கணிப்புகள்',
    recommendations: 'AI பரிந்துரைகள்',
    simulation: 'என்ன-ஆனால் உருவகப்படுத்தல்',
    analytics: 'பிரிவு பகுப்பாய்வு',
    logs: 'கணினி பதிவுகள்',
    settings: 'அமைப்புகள்',

    // Dashboard
    dashboardTitle: 'கட்டுப்பாட்டு டாஷ்போர்டு',
    dashboardSubtitle: 'நிகழ்நேர ரயில்வே போக்குவரத்து கண்காணிப்பு மற்றும் மேம்படுத்தல்',
    liveTrainStatus: 'நேரடி ரயில் நிலை',
    trainsInSection: 'பிரிவில் ரயில்கள்',
    predictedConflicts: 'மோதல் எச்சரிக்கைகள்',
    potentialConflicts: 'சாத்தியமான மோதல்கள் கண்டறியப்பட்டன',
    aiRecommended: 'AI பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்',
    optimizationSuggestions: 'மேம்படுத்தல் பரிந்துரைகள்',
    throughputMetrics: 'பிரிவு செயல்திறன் அளவீடுகள்',
    realTimePerformance: 'நிகழ்நேர செயல்திறன் குறிகாட்டிகள்',

    // Table headers
    trainId: 'ரயில் ID',
    trainName: 'ரயில் பெயர்',
    type: 'வகை',
    currentStation: 'தற்போதைய நிலையம்',
    nextStation: 'அடுத்த நிலையம்',
    delay: 'தாமதம்',
    priority: 'முன்னுரிமை',
    status: 'நிலை',

    // Actions
    accept: 'ஏற்கவும்',
    override: 'மேலெழுதவும்',
    autoResolve: 'தானாக தீர்க்கவும்',
    viewDetails: 'விவரங்களை காண்க',
    save: 'அமைப்புகளை சேமி',
    reset: 'இயல்புநிலைக்கு மீட்டமை',
    saving: 'சேமிக்கிறது...',
    savedSuccess: '✓ தரவுத்தளத்தில் சேமிக்கப்பட்டது',

    // Settings sections
    general: 'பொது',
    aiEngine: 'AI இயந்திரம்',
    trainTrack: 'ரயில் மற்றும் தண்டவாளம்',
    notifications: 'அறிவிப்புகள்',
    display: 'காட்சி',
    security: 'பாதுகாப்பு',
    operatorProfile: 'ஆபரேட்டர் சுயவிவரம்',
    system: 'கணினி',

    // Settings labels
    sectionName: 'பிரிவு / தடம் பெயர்',
    timezone: 'நேர மண்டலம்',
    language: 'மொழி',
    dateFormat: 'தேதி வடிவம்',
    gpsRefresh: 'GPS தரவு புதுப்பிப்பு இடைவெளி (வினாடிகள்)',
    connectedDb: 'DB உடன் இணைக்கப்பட்டது',
    notConnected: 'இணைக்கப்படவில்லை',
    loadingSettings: 'தரவுத்தளத்திலிருந்து அமைப்புகள் ஏற்றப்படுகின்றன...',

    // Metrics
    averageDelay: 'சராசரி தாமதம்',
    trainsPerHour: 'மணிக்கு ரயில்கள்',
    trackUtilization: 'தண்டவாள பயன்பாடு',
    onTimePerformance: 'சரியான நேர செயல்திறன்',
    hourlyThroughput: 'மணிநேர செயல்திறன்',
    delayDistribution: 'தாமத விநியோகம்',
    onTime: 'சரியான நேரத்தில்',

    // Status
    running: 'இயங்குகிறது',
    waiting: 'காத்திருக்கிறது',
    crossing: 'கடக்கிறது',
    liveFromSupabase: 'Supabase இலிருந்து நேரடி',
    mockData: 'மாதிரி தரவு',
  },
};
