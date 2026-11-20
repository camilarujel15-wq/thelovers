import { HandHeart, ShieldCheck, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { BENEFITS } from "@/lib/data";

const ICONS = {
  truck: Truck,
  hand: HandHeart,
  chat: WhatsAppIcon,
  shield: ShieldCheck,
};

export function Benefits() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {BENEFITS.map((benefit) => {
          const Icon = ICONS[benefit.icon];
          return (
            <div key={benefit.title} className="flex items-start gap-4">
              <Icon className="mt-1 h-6 w-6 shrink-0 text-lavender-600" />
              <div>
                <h3 className="font-display text-lg font-semibold text-ink-900">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-sm text-ink-500">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
