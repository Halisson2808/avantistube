import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveApiKeys, getApiKeys, clearApiKeys } from "@/lib/dark/apiKeysStorage";
import { Key, Eye, EyeOff, Trash2, Save } from "lucide-react";

export default function ConfiguracoesLocal() {
    const [claudeKey, setClaudeKey] = useState("");
    const [openaiKey, setOpenaiKey] = useState("");
    const [groqKey, setGroqKey] = useState("");
    const [showClaudeKey, setShowClaudeKey] = useState(false);
    const [showOpenaiKey, setShowOpenaiKey] = useState(false);
    const [showGroqKey, setShowGroqKey] = useState(false);

    useEffect(() => {
        const keys = getApiKeys();
        setClaudeKey(keys.claudeKey);
        setOpenaiKey(keys.openaiKey);
        setGroqKey(keys.groqKey);
    }, []);

    const handleSave = () => {
        if (!claudeKey && !openaiKey && !groqKey) { toast.error("Configure pelo menos uma API Key"); return; }
        saveApiKeys({ claudeKey, openaiKey, groqKey });
        toast.success("API Keys salvas com sucesso!");
    };

    const handleClear = () => {
        clearApiKeys();
        setClaudeKey(""); setOpenaiKey(""); setGroqKey("");
        toast.success("API Keys removidas");
    };

    const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10";

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-gradient">Configurações</h1>
                <p className="text-white/50">Configure suas API Keys para usar as funcionalidades de IA</p>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Key className="h-5 w-5 text-blue-400" /> API Keys
                    </CardTitle>
                    <CardDescription className="text-white/50">
                        As chaves são armazenadas localmente no seu navegador de forma criptografada
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {[
                        { id: "claude", label: "Claude API Key (Anthropic)", value: claudeKey, set: setClaudeKey, show: showClaudeKey, setShow: setShowClaudeKey, placeholder: "sk-ant-api03-...", link: "https://console.anthropic.com/settings/keys", linkText: "Obter chave da Anthropic →", usage: "Roteiros, Títulos, Descrições" },
                        { id: "openai", label: "OpenAI API Key", value: openaiKey, set: setOpenaiKey, show: showOpenaiKey, setShow: setShowOpenaiKey, placeholder: "sk-...", link: "https://platform.openai.com/api-keys", linkText: "Obter chave da OpenAI →", usage: "Tradução, Quebrar Texto" },
                        { id: "groq", label: "Groq API Key", value: groqKey, set: setGroqKey, show: showGroqKey, setShow: setShowGroqKey, placeholder: "gsk_...", link: "https://console.groq.com/keys", linkText: "Obter chave da Groq (gratuito) →", usage: "Transcrição com Whisper (gratuito e mais rápido)" },
                    ].map((field) => (
                        <div key={field.id} className="space-y-2">
                            <Label htmlFor={field.id} className="text-white/70">{field.label}</Label>
                            <div className="relative">
                                <Input id={field.id} type={field.show ? "text" : "password"} value={field.value} onChange={(e) => field.set(e.target.value)} placeholder={field.placeholder} className={inputClass} />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-white/40" onClick={() => field.setShow(!field.show)}>
                                    {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-sm text-white/40">Usado para: {field.usage}</p>
                            <a href={field.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline inline-block">{field.linkText}</a>
                        </div>
                    ))}

                    <div className="flex gap-3 pt-4">
                        <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-500">
                            <Save className="h-4 w-4 mr-2" /> Salvar Configurações
                        </Button>
                        <Button variant="destructive" onClick={handleClear} disabled={!claudeKey && !openaiKey && !groqKey}>
                            <Trash2 className="h-4 w-4 mr-2" /> Limpar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">🔒 Segurança e Privacidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/50">
                    <p>✓ As chaves são armazenadas apenas no seu navegador</p>
                    <p>✓ Nenhuma chave é enviada para servidores externos</p>
                    <p>✓ As requisições são feitas diretamente para Anthropic/OpenAI</p>
                    <p>✓ Você pode limpar as chaves a qualquer momento</p>
                    <p className="text-amber-400 mt-4">⚠️ Não compartilhe suas API Keys com ninguém</p>
                </CardContent>
            </Card>
        </div>
    );
}
