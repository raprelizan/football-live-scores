import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AR } from "@shared/translations";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notifyOwnerMutation = trpc.system.notifyOwner.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await notifyOwnerMutation.mutateAsync({
        title: `رسالة تواصل جديدة من ${formData.name}`,
        content: `البريد الإلكتروني: ${formData.email}\n\nالرسالة:\n${formData.message}`,
      });
      toast.success(AR.pages.contact.success);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(AR.messages.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-accent mb-8">{AR.pages.contact.title}</h1>

          <Card className="p-8 border-accent/50 bg-accent/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  الاسم
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسمك"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  {AR.pages.contact.email}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  {AR.pages.contact.message}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="اكتب رسالتك هنا..."
                  rows={6}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSubmitting ? AR.buttons.loading : AR.pages.contact.send}
              </Button>
            </form>
          </Card>

          <Card className="p-8 mt-8 border-primary/50 bg-primary/5">
            <h2 className="text-2xl font-bold text-primary mb-4">طرق التواصل الأخرى</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">البريد الإلكتروني:</p>
                <a
                  href="mailto:info@footballlive.app"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  info@footballlive.app
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">ساعات العمل:</p>
                <p className="text-foreground">من السبت إلى الخميس: 9 صباحاً - 6 مساءً</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
