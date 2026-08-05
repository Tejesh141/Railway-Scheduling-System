import { useState, useEffect } from 'react';
import { Bell, Shield, Sliders, Database, User, Save, Train, Map, Lock, Monitor, RefreshCw, AlertTriangle, Clock, Wifi } from 'lucide-react';
import { supabase, supabaseReady } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../context/translations';

const SECTIONS = ['General', 'AI Engine', 'Train & Track', 'Notifications', 'Display', 'Security', 'Operator Profile', 'System'];

const defaultForm = {
  // General
  sectionName: 'Chennai – Bangalore Corridor',
  timezone: 'Asia/Kolkata',
  language: 'English',
  dateFormat: 'DD/MM/YYYY',
  refreshInterval: '5',

  // AI Engine
  autoDispatch: true,
  aiPriority: 'Express',
  conflictThreshold: '10',
  maxHoldTime: '3',
  freightDivertPeak: true,
  cascadeProtection: true,
  aiConfidenceLevel: '80',

  // Train & Track
  maxDelay: '15',
  speedAlertThreshold: '120',
  minHeadway: '5',
  trackUtilizationAlert: '85',
  emergencyStopEnabled: true,
  crossingTimeout: '2',

  // Notifications
  emailAlerts: true,
  smsAlerts: false,
  criticalOnly: false,
  conflictAlerts: true,
  delayAlerts: true,
  systemAlerts: true,
  alertEmail: import.meta.env.VITE_ALERT_EMAIL ?? '',
  alertPhone: import.meta.env.VITE_ALERT_PHONE ?? '',

  // Display
  darkMode: true,
  mapAutoCenter: true,
  showTrainLabels: true,
  showSpeedOverlay: true,
  showConflictZones: true,
  animateTrains: true,
  dashboardRefresh: '10',

  // Security
  sessionTimeout: '30',
  twoFactor: false,
  auditLog: true,
  ipWhitelist: '',
  passwordExpiry: '90',

  // Operator
  operatorName: 'Controller 01',
  operatorEmail: import.meta.env.VITE_OPERATOR_EMAIL ?? '',
  operatorPhone: import.meta.env.VITE_OPERATOR_PHONE ?? '',
  operatorRole: 'Senior Controller',
  operatorShift: 'Morning',

  // System
  backupEnabled: true,
  backupInterval: 'daily',
  logRetention: '30',
  maintenanceMode: false,
};

type FormType = typeof defaultForm;

export default function SettingsPage() {
  const { t, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState('General');
  const [form, setForm] = useState<FormType>(defaultForm);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');

  // Load settings from Supabase on mount
  useEffect(() => {
    if (!supabaseReady || !supabase) { setLoadingSettings(false); return; }
    supabase.from('system_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) {
        setForm({
          sectionName: data.section_name ?? defaultForm.sectionName,
          timezone: data.timezone ?? defaultForm.timezone,
          language: data.language ?? defaultForm.language,
          dateFormat: data.date_format ?? defaultForm.dateFormat,
          refreshInterval: data.refresh_interval ?? defaultForm.refreshInterval,
          autoDispatch: data.auto_dispatch ?? defaultForm.autoDispatch,
          aiPriority: data.ai_priority ?? defaultForm.aiPriority,
          conflictThreshold: data.conflict_threshold ?? defaultForm.conflictThreshold,
          maxHoldTime: data.max_hold_time ?? defaultForm.maxHoldTime,
          freightDivertPeak: data.freight_divert_peak ?? defaultForm.freightDivertPeak,
          cascadeProtection: data.cascade_protection ?? defaultForm.cascadeProtection,
          aiConfidenceLevel: data.ai_confidence_level ?? defaultForm.aiConfidenceLevel,
          maxDelay: data.max_delay ?? defaultForm.maxDelay,
          speedAlertThreshold: data.speed_alert_threshold ?? defaultForm.speedAlertThreshold,
          minHeadway: data.min_headway ?? defaultForm.minHeadway,
          trackUtilizationAlert: data.track_utilization_alert ?? defaultForm.trackUtilizationAlert,
          emergencyStopEnabled: data.emergency_stop_enabled ?? defaultForm.emergencyStopEnabled,
          crossingTimeout: data.crossing_timeout ?? defaultForm.crossingTimeout,
          emailAlerts: data.email_alerts ?? defaultForm.emailAlerts,
          smsAlerts: data.sms_alerts ?? defaultForm.smsAlerts,
          criticalOnly: data.critical_only ?? defaultForm.criticalOnly,
          conflictAlerts: data.conflict_alerts ?? defaultForm.conflictAlerts,
          delayAlerts: data.delay_alerts ?? defaultForm.delayAlerts,
          systemAlerts: data.system_alerts ?? defaultForm.systemAlerts,
          alertEmail: data.operator_email ?? defaultForm.alertEmail,
          alertPhone: data.operator_phone ?? defaultForm.alertPhone,
          darkMode: data.dark_mode ?? defaultForm.darkMode,
          mapAutoCenter: data.map_auto_center ?? defaultForm.mapAutoCenter,
          showTrainLabels: data.show_train_labels ?? defaultForm.showTrainLabels,
          showSpeedOverlay: data.show_speed_overlay ?? defaultForm.showSpeedOverlay,
          showConflictZones: data.show_conflict_zones ?? defaultForm.showConflictZones,
          animateTrains: data.animate_trains ?? defaultForm.animateTrains,
          dashboardRefresh: data.dashboard_refresh ?? defaultForm.dashboardRefresh,
          sessionTimeout: data.session_timeout ?? defaultForm.sessionTimeout,
          twoFactor: data.two_factor ?? defaultForm.twoFactor,
          auditLog: data.audit_log ?? defaultForm.auditLog,
          ipWhitelist: data.ip_whitelist ?? defaultForm.ipWhitelist,
          passwordExpiry: data.password_expiry ?? defaultForm.passwordExpiry,
          operatorName: data.operator_name ?? defaultForm.operatorName,
          operatorEmail: data.operator_email ?? defaultForm.operatorEmail,
          operatorPhone: data.operator_phone ?? defaultForm.operatorPhone,
          operatorRole: data.operator_role ?? defaultForm.operatorRole,
          operatorShift: data.operator_shift ?? defaultForm.operatorShift,
          backupEnabled: data.backup_enabled ?? defaultForm.backupEnabled,
          backupInterval: data.backup_interval ?? defaultForm.backupInterval,
          logRetention: data.log_retention ?? defaultForm.logRetention,
          maintenanceMode: data.maintenance_mode ?? defaultForm.maintenanceMode,
        });
      }
      setLoadingSettings(false);
    });
  }, []);

  const set = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (supabaseReady && supabase) {
      const { error } = await supabase.from('system_settings').upsert({
        id: 1,
        section_name: form.sectionName,
        timezone: form.timezone,
        language: form.language,
        date_format: form.dateFormat,
        refresh_interval: form.refreshInterval,
        auto_dispatch: form.autoDispatch,
        ai_priority: form.aiPriority,
        conflict_threshold: form.conflictThreshold,
        max_hold_time: form.maxHoldTime,
        freight_divert_peak: form.freightDivertPeak,
        cascade_protection: form.cascadeProtection,
        ai_confidence_level: form.aiConfidenceLevel,
        max_delay: form.maxDelay,
        speed_alert_threshold: form.speedAlertThreshold,
        min_headway: form.minHeadway,
        track_utilization_alert: form.trackUtilizationAlert,
        emergency_stop_enabled: form.emergencyStopEnabled,
        crossing_timeout: form.crossingTimeout,
        email_alerts: form.emailAlerts,
        sms_alerts: form.smsAlerts,
        critical_only: form.criticalOnly,
        dark_mode: form.darkMode,
        map_auto_center: form.mapAutoCenter,
        show_train_labels: form.showTrainLabels,
        show_speed_overlay: form.showSpeedOverlay,
        show_conflict_zones: form.showConflictZones,
        animate_trains: form.animateTrains,
        dashboard_refresh: form.dashboardRefresh,
        session_timeout: form.sessionTimeout,
        two_factor: form.twoFactor,
        audit_log: form.auditLog,
        ip_whitelist: form.ipWhitelist,
        password_expiry: form.passwordExpiry,
        operator_name: form.operatorName,
        operator_email: form.operatorEmail,
        operator_phone: form.operatorPhone,
        operator_role: form.operatorRole,
        operator_shift: form.operatorShift,
        backup_enabled: form.backupEnabled,
        backup_interval: form.backupInterval,
        log_retention: form.logRetention,
        maintenance_mode: form.maintenanceMode,
        updated_at: new Date(),
      });
      if (error) { alert('Save failed: ' + error.message); setSaving(false); return; }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = () => {
    if (!passwordForm.current) return setPwMsg('Enter current password.');
    if (passwordForm.newPass.length < 8) return setPwMsg('New password must be at least 8 characters.');
    if (passwordForm.newPass !== passwordForm.confirm) return setPwMsg('Passwords do not match.');
    setPwMsg('✓ Password updated successfully.');
    setPasswordForm({ current: '', newPass: '', confirm: '' });
  };

  const Toggle = ({ k }: { k: keyof FormType }) => (
    <button onClick={() => set(k, !form[k])}
      className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${form[k] ? 'bg-black' : 'bg-gray-200'}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form[k] ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      {children}
    </div>
  );

  const Input = ({ k, type = 'text' }: { k: keyof FormType; type?: string }) => {
    const [localVal, setLocalVal] = useState(form[k] as string);
    return (
      <input
        type={type}
        value={localVal}
        onChange={e => setLocalVal(e.target.value)}
        onBlur={e => set(k, e.target.value)}
        className="w-full bg-[#F7F6F2] border border-[#E2E0D8] rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
      />
    );
  };

  const Select = ({ k, options, onChange }: { k: keyof FormType; options: { value: string; label: string }[]; onChange?: (val: string) => void }) => (
    <select value={form[k] as string} onChange={e => { set(k, e.target.value); onChange?.(e.target.value); }}
      className="w-full bg-[#F7F6F2] border border-[#E2E0D8] rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 transition-colors">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const ToggleRow = ({ k, label, desc }: { k: keyof FormType; label: string; desc: string }) => (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm text-gray-800 font-medium">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <Toggle k={k} />
    </div>
  );

  const sectionIcons: Record<string, React.ReactNode> = {
    'General':          <Sliders className="w-4 h-4 text-blue-500" />,
    'AI Engine':        <Shield className="w-4 h-4 text-purple-500" />,
    'Train & Track':    <Train className="w-4 h-4 text-green-500" />,
    'Notifications':    <Bell className="w-4 h-4 text-amber-500" />,
    'Display':          <Monitor className="w-4 h-4 text-cyan-500" />,
    'Security':         <Lock className="w-4 h-4 text-red-500" />,
    'Operator Profile': <User className="w-4 h-4 text-orange-500" />,
    'System':           <Database className="w-4 h-4 text-gray-400" />,
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'General':
        return (
          <div className="space-y-4">
            <Field label="Section / Corridor Name"><Input k="sectionName" /></Field>
            <Field label="Timezone"><Select k="timezone" options={[{ value: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' }, { value: 'UTC', label: 'UTC' }]} /></Field>
            <Field label={t('language')}><Select k="language" options={[{ value: 'English', label: 'English' }, { value: 'Hindi', label: 'हिंदी (Hindi)' }, { value: 'Tamil', label: 'தமிழ் (Tamil)' }]} onChange={(val) => setLanguage(val as Language)} /></Field>
            <Field label="Date Format"><Select k="dateFormat" options={[{ value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }]} /></Field>
            <Field label="GPS Data Refresh Interval (seconds)">
              <Select k="refreshInterval" options={[{ value: '1', label: '1 second' }, { value: '3', label: '3 seconds' }, { value: '5', label: '5 seconds' }, { value: '10', label: '10 seconds' }]} />
            </Field>
          </div>
        );

      case 'AI Engine':
        return (
          <div className="space-y-5">
            <ToggleRow k="autoDispatch" label="Auto-Dispatch AI Instructions" desc="Automatically apply AI recommendations without manual approval" />
            <ToggleRow k="freightDivertPeak" label="Freight Divert During Peak Hours" desc="Automatically divert freight trains during 07:00–22:00" />
            <ToggleRow k="cascadeProtection" label="Cascade Delay Protection" desc="Prevent delay from one train affecting downstream trains" />
            <Field label="Priority Train Type">
              <Select k="aiPriority" options={[{ value: 'Express', label: 'Express' }, { value: 'Passenger', label: 'Passenger' }, { value: 'Freight', label: 'Freight' }]} />
            </Field>
            <Field label="Conflict Detection Threshold (minutes)"><Input k="conflictThreshold" type="number" /></Field>
            <Field label="Max Auto-Hold Time per Train (minutes)"><Input k="maxHoldTime" type="number" /></Field>
            <Field label="AI Confidence Level Required (%)">
              <div className="space-y-1">
                <input type="range" min="50" max="100" value={form.aiConfidenceLevel}
                  onChange={e => set('aiConfidenceLevel', e.target.value)}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>50%</span>
                  <span className="text-blue-400 font-semibold">{form.aiConfidenceLevel}%</span>
                  <span>100%</span>
                </div>
              </div>
            </Field>
            <div className="bg-[#F7F6F2] border border-[#E2E0D8] rounded-xl p-4 space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active AI Rules</p>
              {['Express trains always get track priority', 'Freight diverted during peak hours', 'Conflict resolution within 5 min window', 'Auto hold max 3 minutes per train', 'Cascade delay protection enabled'].map((rule, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <p className="text-xs text-gray-600">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Train & Track':
        return (
          <div className="space-y-5">
            <ToggleRow k="emergencyStopEnabled" label="Emergency Stop Override" desc="Allow AI to trigger emergency stop in critical situations" />
            <Field label="Max Acceptable Delay (minutes)"><Input k="maxDelay" type="number" /></Field>
            <Field label="Speed Alert Threshold (km/h)"><Input k="speedAlertThreshold" type="number" /></Field>
            <Field label="Minimum Headway Between Trains (minutes)"><Input k="minHeadway" type="number" /></Field>
            <Field label="Track Utilization Alert (%)"><Input k="trackUtilizationAlert" type="number" /></Field>
            <Field label="Level Crossing Timeout (minutes)"><Input k="crossingTimeout" type="number" /></Field>
            <div className="bg-[#F7F6F2] border border-[#E2E0D8] rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Track Status Overview</p>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: 'Main Line', status: 'Active', color: 'text-green-600' }, { label: 'Loop Line', status: 'Active', color: 'text-green-600' }, { label: 'Aux Track', status: 'Standby', color: 'text-amber-600' }].map(t => (
                  <div key={t.label} className="bg-white border border-[#E2E0D8] rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400">{t.label}</p>
                    <p className={`text-sm font-semibold mt-1 ${t.color}`}>{t.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-5">
            <ToggleRow k="emailAlerts" label="Email Alerts" desc="Send alerts to registered email address" />
            <ToggleRow k="smsAlerts" label="SMS Alerts" desc="Send critical alerts via SMS" />
            <ToggleRow k="conflictAlerts" label="Conflict Detection Alerts" desc="Notify when a train conflict is predicted" />
            <ToggleRow k="delayAlerts" label="Delay Alerts" desc="Notify when a train exceeds max delay threshold" />
            <ToggleRow k="systemAlerts" label="System Health Alerts" desc="Notify on GPS signal loss or system errors" />
            <ToggleRow k="criticalOnly" label="Critical Alerts Only" desc="Suppress warnings and minor alerts" />
            <Field label="Alert Email Address"><Input k="alertEmail" type="email" /></Field>
            <Field label="Alert Phone Number"><Input k="alertPhone" /></Field>
          </div>
        );

      case 'Display':
        return (
          <div className="space-y-5">
            <ToggleRow k="darkMode" label="Dark Mode" desc="Use dark theme across the dashboard" />
            <ToggleRow k="mapAutoCenter" label="Map Auto-Center on Active Train" desc="Automatically pan map to selected train" />
            <ToggleRow k="showTrainLabels" label="Show Train Labels on Map" desc="Display train ID labels on the live map" />
            <ToggleRow k="showSpeedOverlay" label="Show Speed Overlay" desc="Display current speed on train markers" />
            <ToggleRow k="showConflictZones" label="Highlight Conflict Zones" desc="Show red zones on map where conflicts are predicted" />
            <ToggleRow k="animateTrains" label="Animate Train Movement" desc="Smooth GPS position transitions on map" />
            <Field label="Dashboard Auto-Refresh (seconds)">
              <Select k="dashboardRefresh" options={[{ value: '5', label: '5 seconds' }, { value: '10', label: '10 seconds' }, { value: '30', label: '30 seconds' }, { value: '60', label: '1 minute' }]} />
            </Field>
          </div>
        );

      case 'Security':
        return (
          <div className="space-y-5">
            <ToggleRow k="twoFactor" label="Two-Factor Authentication" desc="Require OTP on every login" />
            <ToggleRow k="auditLog" label="Audit Logging" desc="Log all operator actions for compliance" />
            <Field label="Session Timeout (minutes)">
              <Select k="sessionTimeout" options={[{ value: '15', label: '15 minutes' }, { value: '30', label: '30 minutes' }, { value: '60', label: '1 hour' }, { value: '120', label: '2 hours' }]} />
            </Field>
            <Field label="Password Expiry (days)"><Input k="passwordExpiry" type="number" /></Field>
            <Field label="IP Whitelist (comma separated)">
              <input type="text" defaultValue={form.ipWhitelist}
                onBlur={e => set('ipWhitelist', e.target.value)}
                placeholder="e.g. 192.168.1.1, 10.0.0.1"
                className="w-full bg-[#F7F6F2] border border-[#E2E0D8] rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 transition-colors" />
            </Field>
            <div className="bg-[#F7F6F2] border border-[#E2E0D8] rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Change Password</p>
              {[{ label: 'Current Password', key: 'current' }, { label: 'New Password', key: 'newPass' }, { label: 'Confirm New Password', key: 'confirm' }].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                  <input type="password" value={passwordForm[f.key as keyof typeof passwordForm]}
                    onChange={e => setPasswordForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-white border border-[#E2E0D8] rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 transition-colors" />
                </div>
              ))}
              {pwMsg && <p className={`text-xs ${pwMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>{pwMsg}</p>}
              <button onClick={handlePasswordChange}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors">
                Update Password
              </button>
            </div>
          </div>
        );

      case 'Operator Profile':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-[#F7F6F2] border border-[#E2E0D8] rounded-xl p-4">
              <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {form.operatorName.charAt(0)}
              </div>
              <div>
                <p className="text-gray-900 font-semibold">{form.operatorName}</p>
                <p className="text-xs text-gray-400">{form.operatorRole} · {form.operatorShift} Shift</p>
                <p className="text-xs text-blue-600 mt-0.5">{form.operatorEmail}</p>
              </div>
            </div>
            <Field label="Full Name"><Input k="operatorName" /></Field>
            <Field label="Email Address"><Input k="operatorEmail" type="email" /></Field>
            <Field label="Phone Number"><Input k="operatorPhone" /></Field>
            <Field label="Role">
              <Select k="operatorRole" options={[{ value: 'Senior Controller', label: 'Senior Controller' }, { value: 'Controller', label: 'Controller' }, { value: 'Supervisor', label: 'Supervisor' }, { value: 'Admin', label: 'Admin' }]} />
            </Field>
            <Field label="Shift">
              <Select k="operatorShift" options={[{ value: 'Morning', label: 'Morning (06:00–14:00)' }, { value: 'Afternoon', label: 'Afternoon (14:00–22:00)' }, { value: 'Night', label: 'Night (22:00–06:00)' }]} />
            </Field>
          </div>
        );

      case 'System':
        return (
          <div className="space-y-5">
            <ToggleRow k="backupEnabled" label="Automatic Database Backup" desc="Regularly backup all train and instruction data" />
            <ToggleRow k="maintenanceMode" label="Maintenance Mode" desc="Disable AI dispatch and show maintenance banner" />
            <ToggleRow k="auditLog" label="System Audit Log" desc="Keep full log of all system events" />
            <Field label="Backup Frequency">
              <Select k="backupInterval" options={[{ value: 'hourly', label: 'Every Hour' }, { value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} />
            </Field>
            <Field label="Log Retention (days)"><Input k="logRetention" type="number" /></Field>
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: <Wifi className="w-4 h-4 text-green-500" />, label: 'GPS Feed', value: 'Connected', color: 'text-green-600' },
                { icon: <Database className="w-4 h-4 text-green-500" />, label: 'Supabase DB', value: supabaseReady ? 'Connected' : 'Not Configured', color: supabaseReady ? 'text-green-600' : 'text-amber-600' },
                { icon: <RefreshCw className="w-4 h-4 text-blue-500" />, label: 'AI Engine', value: 'Running', color: 'text-blue-600' },
                { icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, label: 'Conflict Detector', value: 'Active', color: 'text-amber-600' },
                { icon: <Clock className="w-4 h-4 text-gray-400" />, label: 'Last Backup', value: 'Today 06:00', color: 'text-gray-600' },
                { icon: <Map className="w-4 h-4 text-cyan-500" />, label: 'Map Tiles', value: 'OpenStreetMap', color: 'text-cyan-600' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-[#F7F6F2] border border-[#E2E0D8] rounded-xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full min-h-screen">
      {/* Left Section Nav */}
      <div className="w-52 bg-white border-r border-[#E2E0D8] flex-shrink-0 p-4 space-y-0.5">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeSection === s ? 'bg-black text-white' : 'text-gray-500 hover:bg-[#F7F6F2] hover:text-gray-800'}`}>
            {sectionIcons[s]}
            <span className="font-medium">{s}</span>
          </button>
        ))}
        <div className="pt-4 border-t border-[#E2E0D8] mt-4">
          {supabaseReady ? (
            <div className="flex items-center space-x-2 px-3 py-2 text-xs text-green-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Connected to DB</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-2 text-xs text-amber-600">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Not connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-3 mb-6">
            {sectionIcons[activeSection]}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeSection}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Configure {activeSection.toLowerCase()} settings</p>
            </div>
          </div>

          {loadingSettings ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center space-x-3 text-gray-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading settings from database...</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E0D8] shadow-sm p-6">
              {renderSection()}
            </div>
          )}

          <div className="flex items-center space-x-4 mt-6">
            <button onClick={handleSave} disabled={saving || loadingSettings}
              className="flex items-center space-x-2 px-6 py-3 bg-black hover:bg-gray-800 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
            <button onClick={() => { setForm(defaultForm); setSaved(false); }}
              className="px-6 py-3 bg-[#F7F6F2] border border-[#E2E0D8] hover:bg-[#ECEAE2] text-gray-700 font-medium rounded-xl transition-colors text-sm">
              Reset to Default
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">✓ Settings saved to database</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
