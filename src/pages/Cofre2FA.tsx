import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  RefreshCw,
  Download,
  Upload,
  Clock,
  ChevronDown,
  ChevronUp,
  FileCode2,
  CheckCircle2,
  CircleDot,
  RotateCcw,
  Video,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  VaultAccount,
  BackupCodeItem,
  generateTotp,
  cleanSecret,
  parseBackupCodes,
  TotpResult,
} from '@/lib/vaultCrypto';

const LOCAL_STORAGE_BACKUP_KEY = 'avantistube_accounts_cache';

export default function Cofre2FA() {
  const [accounts, setAccounts] = useState<VaultAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // TOTP Live ticker (atualiza a cada 1s)
  const [tick, setTick] = useState(0);

  // Visibilidade de senhas individuais e códigos de backup expandidos por ID
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [expandedBackupCodes, setExpandedBackupCodes] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<VaultAccount | null>(null);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

  // Formulário de Conta
  const [formChannelName, setFormChannelName] = useState('');
  const [formChannelUrl, setFormChannelUrl] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formSecret2fa, setFormSecret2fa] = useState('');
  const [formBackupCodesRaw, setFormBackupCodesRaw] = useState('');
  const [formBackupCodesList, setFormBackupCodesList] = useState<BackupCodeItem[]>([]);
  const [formNotes, setFormNotes] = useState('');

  // Arquivo de importação
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Carregar Contas do Banco de Dados (Supabase) ──────────────────────────
  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAccounts(data);
          try {
            localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(data));
          } catch {}
          return;
        }
      }
    } catch (err) {
      console.error('Erro ao carregar contas:', err);
    } finally {
      setIsLoading(false);
    }

    // Fallback local se offline
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
      if (cached) {
        setAccounts(JSON.parse(cached));
      }
    } catch {}
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // Intervalo do relógio para atualizar os códigos TOTP a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Salvar no Banco de Dados (Supabase) ───────────────────────────────────
  const saveAccountsToDatabase = async (updatedAccounts: VaultAccount[]) => {
    setAccounts(updatedAccounts);
    try {
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(updatedAccounts));
    } catch {}

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAccounts),
      });

      if (!res.ok) {
        toast.error('Erro ao salvar no banco de dados');
      }
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
      toast.error('Falha de conexão com o banco de dados');
    }
  };

  // ─── CRUD de Contas ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingAccount(null);
    setFormChannelName('');
    setFormChannelUrl('');
    setFormEmail('');
    setFormPassword('');
    setFormSecret2fa('');
    setFormBackupCodesRaw('');
    setFormBackupCodesList([]);
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (account: VaultAccount) => {
    setEditingAccount(account);
    setFormChannelName(account.channelName);
    setFormChannelUrl(account.channelUrl || '');
    setFormEmail(account.email);
    setFormPassword(account.password || '');
    setFormSecret2fa(account.secret2fa);
    setFormBackupCodesList(account.backupCodes || []);
    setFormBackupCodesRaw(account.backupCodes?.map((b) => b.code).join('\n') || '');
    setFormNotes(account.notes || '');
    setIsAddModalOpen(true);
  };

  const handleParseBackupCodesInput = (rawText: string) => {
    setFormBackupCodesRaw(rawText);
    const parsed = parseBackupCodes(rawText);
    setFormBackupCodesList(parsed);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChannelName.trim() || !formEmail.trim()) {
      toast.error('Nome do canal e e-mail são obrigatórios');
      return;
    }

    const now = new Date().toISOString();
    const finalBackupCodes =
      formBackupCodesList.length > 0
        ? formBackupCodesList
        : parseBackupCodes(formBackupCodesRaw);

    if (editingAccount) {
      // Editar conta existente
      const updated = accounts.map((acc) =>
        acc.id === editingAccount.id
          ? {
              ...acc,
              channelName: formChannelName.trim(),
              channelUrl: formChannelUrl.trim(),
              email: formEmail.trim(),
              password: formPassword,
              secret2fa: cleanSecret(formSecret2fa),
              backupCodes: finalBackupCodes,
              notes: formNotes.trim(),
              updatedAt: now,
            }
          : acc
      );
      await saveAccountsToDatabase(updated);
      toast.success('Conta atualizada no banco de dados!');
    } else {
      // Adicionar nova conta
      const newAcc: VaultAccount = {
        id: crypto.randomUUID ? crypto.randomUUID() : `acc_${Date.now()}`,
        channelName: formChannelName.trim(),
        channelUrl: formChannelUrl.trim(),
        email: formEmail.trim(),
        password: formPassword,
        secret2fa: cleanSecret(formSecret2fa),
        backupCodes: finalBackupCodes,
        notes: formNotes.trim(),
        createdAt: now,
        updatedAt: now,
      };
      await saveAccountsToDatabase([newAcc, ...accounts]);
      toast.success('Canal, 2FA e Códigos de Backup salvos no banco!');
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!deletingAccountId) return;
    const updated = accounts.filter((a) => a.id !== deletingAccountId);
    await saveAccountsToDatabase(updated);
    setDeletingAccountId(null);
    toast.success('Conta removida do banco de dados');
  };

  // ─── Status de Código de Backup (Usado / Não Usado) ──────────────────────────

  const toggleBackupCodeUsed = async (accountId: string, codeIndex: number) => {
    const updated = accounts.map((acc) => {
      if (acc.id !== accountId || !acc.backupCodes) return acc;
      const codes = [...acc.backupCodes];
      if (codes[codeIndex]) {
        codes[codeIndex] = { ...codes[codeIndex], used: !codes[codeIndex].used };
      }
      return { ...acc, backupCodes: codes, updatedAt: new Date().toISOString() };
    });
    await saveAccountsToDatabase(updated);
  };

  const resetAllBackupCodes = async (accountId: string) => {
    const updated = accounts.map((acc) => {
      if (acc.id !== accountId || !acc.backupCodes) return acc;
      const codes = acc.backupCodes.map((c) => ({ ...c, used: false }));
      return { ...acc, backupCodes: codes, updatedAt: new Date().toISOString() };
    });
    await saveAccountsToDatabase(updated);
    toast.success('Códigos de backup redefinidos como disponíveis!');
  };

  // ─── Copiar Campos e Visualização ───────────────────────────────────────────

  const copyToClipboard = (text: string, fieldId: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBackupCodesSection = (id: string) => {
    setExpandedBackupCodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ─── Backup e Restauração em Arquivo JSON ───────────────────────────────────

  const handleExportBackup = () => {
    if (accounts.length === 0) {
      toast.error('Nenhuma conta para exportar');
      return;
    }
    const blob = new Blob([JSON.stringify(accounts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `avantistube_contas_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup exportado com sucesso!');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const text = ev.target?.result as string;
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            await saveAccountsToDatabase(parsed);
            toast.success(`Backup importado! ${parsed.length} contas carregadas e salvas no banco.`);
          } else {
            throw new Error('Formato de arquivo inválido');
          }
        } catch (err: any) {
          toast.error(err.message || 'Falha ao ler arquivo');
        }
      };
      reader.readAsText(file);
    } catch {
      toast.error('Erro ao abrir arquivo');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ─── Contas Filtradas ───────────────────────────────────────────────────────

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) return accounts;
    const q = searchQuery.toLowerCase();
    return accounts.filter(
      (a) =>
        a.channelName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.notes && a.notes.toLowerCase().includes(q))
    );
  }, [accounts, searchQuery]);

  // Preview de TOTP no modal de adicionar/editar
  const formTotpPreview = useMemo(() => {
    if (!formSecret2fa) return null;
    return generateTotp(formSecret2fa);
  }, [formSecret2fa, tick]);

  // ─── RENDER PRINCIPAL ───────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Superior */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-md shadow-red-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Cofre 2FA & Contas
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Banco de Dados Ativo
                </span>
              </h1>
              <p className="text-xs text-white/50 mt-0.5">
                {accounts.length} {accounts.length === 1 ? 'conta do YouTube' : 'contas do YouTube'} com autenticador TOTP e 10 Códigos de Backup
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={openAddModal}
            className="bg-red-600 hover:bg-red-500 text-white text-xs h-9 shadow-lg shadow-red-600/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Adicionar Canal
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={loadAccounts}
            disabled={isLoading}
            className="h-9 text-xs border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            title="Atualizar do Banco de Dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-red-400 ${isLoading ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportBackup}
            className="h-9 text-xs border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            title="Exportar backup em arquivo JSON"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Exportar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 text-xs border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            title="Importar contas de um arquivo JSON"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
            Importar
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nome do canal, e-mail, códigos de backup ou anotações..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/[0.08] text-white text-xs h-10 rounded-xl focus:border-red-500/40"
        />
      </div>

      {/* Grid de Canais / Contas */}
      {filteredAccounts.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-white/40">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">Nenhum canal encontrado</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery
              ? 'Nenhum canal corresponde à sua busca.'
              : 'Adicione suas contas do YouTube para gerar os códigos 2FA e guardar logins e códigos de backup com segurança.'}
          </p>
          {!searchQuery && (
            <Button
              onClick={openAddModal}
              size="sm"
              className="bg-red-600 hover:bg-red-500 text-white text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Adicionar Primeiro Canal
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => {
            const totp: TotpResult = generateTotp(account.secret2fa);
            const isPasswordVisible = !!visiblePasswords[account.id];
            const isBackupExpanded = !!expandedBackupCodes[account.id];

            const backupCodes = account.backupCodes || [];
            const availableCodesCount = backupCodes.filter((b) => !b.used).length;
            const totalCodesCount = backupCodes.length;

            return (
              <Card
                key={account.id}
                className="bg-white/[0.03] border-white/[0.08] hover:border-white/20 transition-all rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col justify-between group shadow-lg shadow-black/20"
              >
                <div>
                  {/* Topo do Card: Nome e Ações */}
                  <div className="p-4 pb-3 border-b border-white/5 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-red-600/30">
                          {account.channelName.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-sm font-bold text-white truncate leading-tight">
                          {account.channelName}
                        </h3>
                      </div>
                      {account.channelUrl && (
                        <a
                          href={
                            account.channelUrl.startsWith('http')
                              ? account.channelUrl
                              : `https://${account.channelUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors mt-1 truncate max-w-full"
                        >
                          <span>Abrir canal no YouTube</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(account)}
                        className="h-7 w-7 text-white/50 hover:text-white hover:bg-white/5"
                        title="Editar Conta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingAccountId(account.id)}
                        className="h-7 w-7 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                        title="Remover Conta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Bloco de Código 2FA em Destaque */}
                  <div className="p-4 bg-black/20 border-b border-white/5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-red-400" />
                        Código 2FA (Google Authenticator)
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          totp.remainingSeconds <= 5 ? 'text-red-400 animate-pulse' : 'text-white/60'
                        }`}
                      >
                        {totp.remainingSeconds}s
                      </span>
                    </div>

                    <div
                      onClick={() =>
                        totp.isValid && copyToClipboard(totp.token, `2fa_${account.id}`, 'Código 2FA')
                      }
                      className="cursor-pointer group/code flex items-center justify-between bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 p-2.5 rounded-xl transition-all"
                    >
                      <span className="font-mono text-2xl font-black tracking-widest text-white group-hover/code:text-red-400 transition-colors">
                        {totp.token.length === 6
                          ? `${totp.token.slice(0, 3)} ${totp.token.slice(3)}`
                          : totp.token}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-white/60 group-hover/code:text-white group-hover/code:bg-white/10"
                      >
                        {copiedField === `2fa_${account.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="ml-1 text-[11px]">Copiar</span>
                      </Button>
                    </div>

                    {/* Barra de Progresso do Tempo (30s) */}
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          totp.remainingSeconds <= 5 ? 'bg-red-500' : 'bg-red-400/80'
                        }`}
                        style={{ width: `${totp.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Informações de Login (Email e Senha) */}
                  <div className="p-4 space-y-2.5 text-xs">
                    {/* E-mail */}
                    <div className="flex items-center justify-between bg-white/[0.02] p-2 rounded-lg border border-white/5">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-[10px] text-white/40 uppercase tracking-wide">E-mail</p>
                        <p className="text-xs text-white/90 font-mono truncate">{account.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(account.email, `email_${account.id}`, 'E-mail')}
                        className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10 shrink-0"
                        title="Copiar E-mail"
                      >
                        {copiedField === `email_${account.id}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>

                    {/* Senha */}
                    {account.password && (
                      <div className="flex items-center justify-between bg-white/[0.02] p-2 rounded-lg border border-white/5">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-[10px] text-white/40 uppercase tracking-wide">Senha</p>
                          <p className="text-xs text-white/90 font-mono truncate">
                            {isPasswordVisible ? account.password : '••••••••••••'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(account.id)}
                            className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10"
                            title={isPasswordVisible ? 'Ocultar Senha' : 'Ver Senha'}
                          >
                            {isPasswordVisible ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(account.password || '', `pwd_${account.id}`, 'Senha')
                            }
                            className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10"
                            title="Copiar Senha"
                          >
                            {copiedField === `pwd_${account.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Seção dos 10 Códigos de Backup */}
                    {totalCodesCount > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => toggleBackupCodesSection(account.id)}
                          className="w-full flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <FileCode2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-[11px] font-semibold text-white/90">
                              10 Códigos de Backup
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                availableCodesCount === 0
                                  ? 'bg-red-500/20 text-red-400'
                                  : availableCodesCount <= 3
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-emerald-500/15 text-emerald-400'
                              }`}
                            >
                              {availableCodesCount}/{totalCodesCount} disponíveis
                            </span>
                          </div>
                          {isBackupExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-white/40" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                          )}
                        </button>

                        {isBackupExpanded && (
                          <div className="mt-2 space-y-1.5 p-2 bg-black/30 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between pb-1 border-b border-white/5 text-[10px] text-white/40">
                              <span>Clique para copiar ou marque como usado:</span>
                              {availableCodesCount < totalCodesCount && (
                                <button
                                  type="button"
                                  onClick={() => resetAllBackupCodes(account.id)}
                                  className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
                                  title="Marcar todos como disponíveis"
                                >
                                  <RotateCcw className="w-2.5 h-2.5" />
                                  Resetar
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              {backupCodes.map((item, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg border transition-all ${
                                    item.used
                                      ? 'bg-white/[0.01] border-white/5 opacity-40 line-through'
                                      : 'bg-white/[0.04] border-white/10 hover:border-amber-400/30'
                                  }`}
                                >
                                  <span className="font-mono text-xs font-semibold text-white/90">
                                    {item.code}
                                  </span>
                                  <div className="flex items-center gap-0.5 shrink-0 ml-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyToClipboard(
                                          item.code,
                                          `bcode_${account.id}_${idx}`,
                                          'Código de Backup'
                                        )
                                      }
                                      className="h-5 w-5 p-0 text-white/40 hover:text-white"
                                      title="Copiar código"
                                    >
                                      {copiedField === `bcode_${account.id}_${idx}` ? (
                                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-2.5 h-2.5" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleBackupCodeUsed(account.id, idx)}
                                      className="h-5 w-5 p-0 text-white/40 hover:text-amber-400"
                                      title={item.used ? 'Marcar como NÃO usado' : 'Marcar como USADO'}
                                    >
                                      {item.used ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                      ) : (
                                        <CircleDot className="w-3 h-3 text-white/30" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notas extras */}
                    {account.notes && (
                      <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-white/50 bg-white/[0.01] p-2 rounded-lg">
                        <span className="text-[10px] font-semibold text-white/30 uppercase block mb-0.5">
                          Anotações:
                        </span>
                        <p className="line-clamp-2 text-white/70 whitespace-pre-line">{account.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── MODAL: ADICIONAR / EDITAR CONTA ─── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-[hsl(240,10%,5%)] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-red-500" />
              {editingAccount ? 'Editar Canal & 2FA' : 'Adicionar Novo Canal ao Cofre'}
            </DialogTitle>
            <DialogDescription className="text-xs text-white/60">
              Salvo diretamente no banco de dados Supabase sincronizado com o sistema.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAccount} className="space-y-3.5 py-2">
            {/* Atalho: Selecionar de Meus Canais */}
            {!editingAccount && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <Label className="text-[11px] text-white/60">Importar dados de um canal cadastrado:</Label>
                <select
                  onChange={(e) => {
                    const sel = e.target.value;
                    if (!sel) return;
                    try {
                      const [name, id] = sel.split('|||');
                      setFormChannelName(name);
                      setFormChannelUrl(`https://youtube.com/channel/${id}`);
                    } catch {}
                  }}
                  defaultValue=""
                  className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-red-500/50 outline-none"
                >
                  <option value="" className="bg-[hsl(240,10%,5%)] text-white/50">
                    -- Escolha um canal cadastrado no sistema para preencher --
                  </option>
                  {[
                    { name: 'Halisson', id: 'UC63dhjjyajWtDZuYRIwoQTw' },
                    { name: 'Coração do Interior', id: 'UCJdm5Op5_2INDXJiKRRPn9A' },
                    { name: 'Absolute Past', id: 'UCW6lFQIDHcJ7GfcjFnPLBWg' },
                    { name: 'La Tierra Sabe', id: 'UCRCZ6SFNDIm-VeJi1FpsAcA' },
                    { name: 'Tempo Rural', id: 'UClPY82v8malsDIu1ar8Sp2w' },
                    { name: 'Ecologizando', id: 'UCfG9YSf52iftCLiddsYDnxw' },
                    { name: 'Hermetic Laboratory', id: 'UCSIXjeSwSC6mkhNuZsQKhww' },
                    { name: 'Paradoja Animal', id: 'UCM1X9AiPdrBUw-OwqqfyMGA' },
                  ].map((ch) => (
                    <option key={ch.id} value={`${ch.name}|||${ch.id}`} className="bg-[hsl(240,10%,5%)] text-white">
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-white/80">Nome do Canal *</Label>
                <Input
                  required
                  placeholder="Ex: Canal Dark Curiosidades"
                  value={formChannelName}
                  onChange={(e) => setFormChannelName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white text-xs h-9 focus:border-red-500/50"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-white/80">Link do YouTube</Label>
                <Input
                  placeholder="youtube.com/@seucanal"
                  value={formChannelUrl}
                  onChange={(e) => setFormChannelUrl(e.target.value)}
                  className="bg-white/5 border-white/10 text-white text-xs h-9 focus:border-red-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-white/80">E-mail da Conta *</Label>
                <Input
                  required
                  type="email"
                  placeholder="login@gmail.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white text-xs h-9 focus:border-red-500/50"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-white/80">Senha</Label>
                <Input
                  type="password"
                  placeholder="Senha da conta"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white text-xs h-9 focus:border-red-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-white/80 flex items-center justify-between">
                <span>Chave Secreta 2FA (Secret Key Base32) *</span>
                <span className="text-[10px] text-white/40">Ou cole a URL otpauth://</span>
              </Label>
              <Input
                required
                placeholder="Ex: JBSWY3DPEHPK3PXP ou otpauth://totp/..."
                value={formSecret2fa}
                onChange={(e) => setFormSecret2fa(e.target.value)}
                className="bg-white/5 border-white/10 text-white font-mono text-xs h-9 focus:border-red-500/50 uppercase"
              />
            </div>

            {/* Preview do TOTP gerado */}
            {formTotpPreview && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-red-400">Teste do Código em Tempo Real:</p>
                  <p className="font-mono text-xl font-black text-white tracking-widest mt-0.5">
                    {formTotpPreview.token}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/60">Troca em {formTotpPreview.remainingSeconds}s</span>
                  <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-red-400 h-full transition-all"
                      style={{ width: `${formTotpPreview.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Seção dos 10 Códigos de Backup */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs text-white/80 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                  10 Códigos de Backup do Google (Cole o bloco de texto)
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  {formBackupCodesList.length > 0 ? `${formBackupCodesList.length} identificados` : ''}
                </span>
              </Label>
              <Textarea
                rows={3}
                placeholder="Cole aqui os 10 códigos de backup gerados pelo Google (ex: 1234 5678, um por linha)..."
                value={formBackupCodesRaw}
                onChange={(e) => handleParseBackupCodesInput(e.target.value)}
                className="bg-white/5 border-white/10 text-white font-mono text-xs resize-none focus:border-amber-400/50"
              />

              {/* Chips dos códigos reconhecidos */}
              {formBackupCodesList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                  {formBackupCodesList.map((c, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]"
                    >
                      {c.code}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-white/80">Outras Anotações</Label>
              <Textarea
                rows={2}
                placeholder="Anotações gerais, links secundários ou observações..."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="bg-white/5 border-white/10 text-white text-xs resize-none focus:border-red-500/50"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-white/60 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
              >
                {editingAccount ? 'Salvar Alterações' : 'Adicionar ao Cofre'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── ALERT: CONFIRMAR EXCLUSÃO DE CONTA ─── */}
      <AlertDialog
        open={!!deletingAccountId}
        onOpenChange={(open) => !open && setDeletingAccountId(null)}
      >
        <AlertDialogContent className="bg-[hsl(240,10%,5%)] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold text-white">
              Remover este canal do cofre?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-white/60">
              Esta ação removerá a conta, a chave 2FA e os códigos de backup do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 text-xs h-8">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-500 text-white text-xs h-8"
            >
              Sim, Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
