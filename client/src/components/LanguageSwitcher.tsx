import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "@/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === i18n.language
  ) || supportedLanguages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 min-w-[60px] text-white hover:text-secondary hover:bg-blue-800/30 transition-colors flex-shrink-0"
        >
          <Globe className="h-4 w-4 mr-1" />
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="text-sm ml-1 hidden lg:inline">{currentLanguage.name}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50"
        sideOffset={5}
      >
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`
              flex items-center px-3 py-2 text-sm cursor-pointer transition-colors
              ${i18n.language === language.code 
                ? 'bg-[#001937] text-white' 
                : 'hover:bg-gray-100 text-gray-700'
              }
            `}
          >
            <span className="mr-3 text-base">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {i18n.language === language.code && (
              <span className="ml-2 text-xs opacity-75">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}