var tabelaPcctae = angular.module('tabela_pcctae', ['angular-loading-bar', 'ngTouch', 'ngStorage'])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
  }]);

function roundup(num){
	return Math.ceil(num * 100) / 100;
};

tabelaPcctae
.directive('reloadSelect', function($timeout) {
	return function(scope, element, attrs, ngModel) {
		$timeout(function() {
			scope.$emit('reloadSelect', element, attrs, ngModel);
		}, 500);
	};
})
.controller('main-controller', ['$scope', '$http', '$localStorage', function ($scope, $http, $localStorage) {
	$scope.loaded = null;
	if ($(window).width() < 993) {
		$scope.showInicio = true;
		$scope.showResultado = false;
	} else {
		$scope.showInicio = true;
		$scope.showResultado = true;
	};
	$scope.save = function() {
		$localStorage.estrutura = this.estrutura;
		$localStorage.classe = this.classe;
		$localStorage.nivel = this.nivel;
		$localStorage.qualificacao = this.qualificacao;
		$localStorage.relacao = this.relacao;
		$localStorage.gratificacao = this.gratificacao;
		$localStorage.insalubridade = this.insalubridade;
		$localStorage.saude_idade = this.saude_idade;
		$localStorage.preescola = this.preescola;
		$localStorage.auxilio_transporte_input = this.auxilio_transporte_input;
		$localStorage.outras_input = this.outras_input;
		$localStorage.previdencia_complementar_input = this.previdencia_complementar_input;
		$localStorage.funpresp_input = this.funpresp_input;
		$localStorage.modelo_novo_previdencia_input = this.modelo_novo_previdencia_input;
		$localStorage.adicionar_ferias_input = this.adicionar_ferias_input;
		$localStorage.adicionar_primeira_parcela_gratificacao_input = this.adicionar_primeira_parcela_gratificacao_input;
		$localStorage.adicionar_segunda_parcela_gratificacao_input = this.adicionar_segunda_parcela_gratificacao_input;
    };

    $scope.load = function() {

    	if($localStorage.estrutura){
    		this.estrutura = $localStorage.estrutura;
    	};
    	if($localStorage.classe){
    		this.classe = $localStorage.classe;
    	};
    	if($localStorage.nivel){
    		this.nivel = $localStorage.nivel;
    	};
    	if($localStorage.qualificacao){
    		this.qualificacao = $localStorage.qualificacao;
    	};
    	if($localStorage.relacao){
    		this.relacao = $localStorage.relacao;
    	};
    	if($localStorage.gratificacao){
    		this.gratificacao = $localStorage.gratificacao;
    	};
    	if($localStorage.insalubridade){
    		this.insalubridade = $localStorage.insalubridade;
    	};
    	if($localStorage.saude_idade){
    		this.saude_idade = $localStorage.saude_idade;
    	};
    	if($localStorage.preescola){
    		this.preescola = $localStorage.preescola;
    	};
    	if($localStorage.auxilio_transporte_input){
    		this.auxilio_transporte_input = $localStorage.auxilio_transporte_input;
    	};
    	if($localStorage.outras_input){
    		this.outras_input = $localStorage.outras_input;
    	};
    	if($localStorage.previdencia_complementar_input){
    		this.previdencia_complementar_input = $localStorage.previdencia_complementar_input;
    	};
    	if($localStorage.funpresp_input){
    		this.funpresp_input = $localStorage.funpresp_input;
    	};
    	if($localStorage.modelo_novo_previdencia_input){
    		this.modelo_novo_previdencia_input = $localStorage.modelo_novo_previdencia_input;
    	};
    	if($localStorage.adicionar_ferias_input){
    		this.adicionar_ferias_input = $localStorage.adicionar_ferias_input;
    	};
    	if($localStorage.adicionar_primeira_parcela_gratificacao_input){
    		this.adicionar_primeira_parcela_gratificacao_input = $localStorage.adicionar_primeira_parcela_gratificacao_input;
    	};
    	if($localStorage.adicionar_segunda_parcela_gratificacao_input){
    		this.adicionar_segunda_parcela_gratificacao_input = $localStorage.adicionar_segunda_parcela_gratificacao_input;
    	};
    };

    $scope.delete = function() {
    	delete $localStorage.estrutura;
    	delete $localStorage.classe;
		delete $localStorage.nivel;
		delete $localStorage.qualificacao;
		delete $localStorage.relacao;
		delete $localStorage.gratificacao;
		delete $localStorage.insalubridade;
		delete $localStorage.saude_idade;
		delete $localStorage.preescola;
		delete $localStorage.auxilio_transporte_input;
		delete $localStorage.outras_input;
		delete $localStorage.previdencia_complementar_input;
		delete $localStorage.funpresp_input;
		delete $localStorage.modelo_novo_previdencia_input;
		delete $localStorage.adicionar_ferias_input;
		delete $localStorage.adicionar_primeira_parcela_gratificacao_input;
		delete $localStorage.adicionar_segunda_parcela_gratificacao_input;
    	window.location.reload();
	};

	$scope.update = function(){
		if ($scope.estrutura){
			$scope.auxilio_alimentacao = $scope.everything[$scope.estrutura].alimentacao.toFixed(2);
		};
		
		if($scope.estrutura && $scope.preescola){
			$scope.auxilio_preescola = ($scope.everything[$scope.estrutura]["auxilio_preescola"] * $scope.preescola).toFixed(2);  
		};

		if($scope.estrutura && $scope.classe && $scope.nivel) {
			calcular_vencimento_basico($scope);
		};

		if($scope.estrutura && $scope.classe && $scope.nivel && $scope.insalubridade) {
			calcular_insalubridade($scope);
		};
		
		if($scope.estrutura && $scope.classe && $scope.nivel && $scope.relacao && $scope.qualificacao) {
			calcular_gratificacao_qualificacao($scope);
			if($scope.saude_idade){
				calcular_saude($scope);
			};
		};
		
		if($scope.gratificacao && $scope.estrutura) {
			calcular_gratificacao_funcao($scope);
		};

		if($scope.auxilio_transporte_input){
			$scope.auxilio_transporte = $scope.auxilio_transporte_input.toFixed(2);
		};

		if($scope.outras_input){
			$scope.outras = $scope.outras_input.toFixed(2);
		};
		

		$scope.salario_bruto = 	parseFloat($scope.vencimento_basico) + parseFloat($scope.incentivo_qualificacao) + 
								parseFloat($scope.gratificacao_basico) + parseFloat($scope.adicional_insalubridade) + 
								parseFloat($scope.auxilio_preescola) + parseFloat($scope.auxilio_alimentacao) + 
								parseFloat($scope.outras) + parseFloat($scope.auxilio_transporte) + 
								parseFloat($scope.saude_suplementar);
		
		$scope.base_inss = 	parseFloat($scope.vencimento_basico) + parseFloat($scope.incentivo_qualificacao) + 
							parseFloat($scope.adicional_insalubridade);
		$scope.base_inss = $scope.base_inss.toFixed(2);
		$scope.base_funpresp = $scope.base_inss;

		if($scope.previdencia_complementar_input){
			$scope.previdencia_complementar = $scope.previdencia_complementar_input.toFixed(2);
		};

		if ($scope.estrutura){
			if($scope.salario_bruto > $scope.everything[$scope.estrutura].inss[2][0]){
				$scope.bruto_maior_teto = true;
			};
			calcular_previdencia($scope);
			if($scope.funpresp_input){
				calcular_funpresp($scope);
			};
			calcular_irpf($scope);
			calcular_ferias($scope);
			gratificacao_natalina_1($scope);
			gratificacao_natalina_2($scope);
		};

		$scope.total_desconto = parseFloat($scope.desconto_inss) + parseFloat($scope.previdencia_complementar) + parseFloat($scope.funpresp) + parseFloat($scope.desconto_irpf);
		
		if($scope.adicionar_ferias_input){
			$scope.total_desconto = $scope.total_desconto + parseFloat($scope.desconto_irpf_ferias);
			$scope.salario_bruto = $scope.salario_bruto + parseFloat($scope.ferias);
		};

		if($scope.adicionar_primeira_parcela_gratificacao_input){
			$scope.salario_bruto = $scope.salario_bruto + parseFloat($scope.gratificacao_natalina_1);
		};

		if($scope.adicionar_segunda_parcela_gratificacao_input){
			$scope.salario_bruto = $scope.salario_bruto + parseFloat($scope.gratificacao_natalina_2);
			$scope.total_desconto = $scope.total_desconto + parseFloat($scope.outros_descontos);
		};
		
		$scope.salario_liquido = $scope.salario_bruto - $scope.total_desconto;
		
		$scope.salario_bruto = $scope.salario_bruto.toFixed(2);
		$scope.total_desconto = $scope.total_desconto.toFixed(2);
		$scope.salario_liquido = $scope.salario_liquido.toFixed(2);
		$scope.save();
	};

	function calcular_vencimento_basico(scope){
		scope.vencimento_basico = scope.menor_vencimento * scope.everything[scope.estrutura].aumento;
		scope.salto = scope.classe + scope.nivel - 2;
		scope.vencimento_basico = scope.vencimento_basico * (Math.pow(scope.everything[scope.estrutura].step, scope.salto));
		scope.vencimento_basico = scope.vencimento_basico.toFixed(2);
	};

	function calcular_insalubridade(scope){
		scope.adicional_insalubridade = (scope.vencimento_basico * scope.insalubridade).toFixed(2);
	};

	function calcular_gratificacao_qualificacao(scope){
		var indice = scope.qualificacoes.indexOf(scope.qualificacao);
		scope.percentuais_relacao = scope.relacoes[scope.relacao][indice];
		scope.incentivo_qualificacao = (scope.vencimento_basico * scope.percentuais_relacao).toFixed(2);
	};

	function calcular_gratificacao_funcao(scope){
		var indice = scope.gratificacoes.indexOf(scope.gratificacao);
		scope.gratificacao_basico = scope.everything[scope.estrutura].gratificacoes[indice].toFixed(2);
	};

	function calcular_previdencia(scope){
		var teto_inss = scope.everything[scope.estrutura].inss[2][0];
		var percentual_inss = 0;
		var contador = 0;
		var inss = scope.everything[scope.estrutura].inss;

		while((contador < inss.length) && (inss[contador][0] < scope.base_inss)) {
			percentual_inss = inss[contador][1];
			contador++;
		};

		scope.aliquota_inss = parseFloat(percentual_inss * 100).toFixed(2);
		scope.aliquota_inss += '%';
		if (scope.modelo_novo_previdencia_input && (scope.base_inss >= teto_inss)){
			scope.desconto_inss = teto_inss * percentual_inss;
			scope.base_inss = teto_inss.toFixed(2);
		} else {
			scope.desconto_inss = scope.base_inss * percentual_inss;
		};
		scope.desconto_inss = scope.desconto_inss.toFixed(2);
	};

	function calcular_ferias(scope){
		var ferias = (parseFloat(scope.vencimento_basico) + parseFloat(scope.incentivo_qualificacao)) / 3;
		var irpf = scope.everything[scope.estrutura].irpf;

		var contador = 0;
		var percentual_irpf = 0;
		var abatimento_irpf = 0;
		while((contador < irpf.length) && (irpf[contador][0] < ferias)) {
			percentual_irpf = irpf[contador][1];
			abatimento_irpf = irpf[contador][2];
			contador++;
		};

		scope.desconto_irpf_ferias = (ferias * percentual_irpf) - abatimento_irpf;
		scope.desconto_irpf_ferias = parseFloat(scope.desconto_irpf_ferias).toFixed(2);
		scope.ferias = ferias.toFixed(2);
	};

	function gratificacao_natalina_1(scope){
		var gratificacao_natalina_1 = (parseFloat(scope.vencimento_basico) + parseFloat(scope.incentivo_qualificacao)) / 2;
		scope.gratificacao_natalina_1 = gratificacao_natalina_1.toFixed(2);

	};
	
	function gratificacao_natalina_2(scope){
		var gratificacao_natalina_2 = (parseFloat(scope.vencimento_basico) + parseFloat(scope.incentivo_qualificacao)); 
 
		scope.outros_descontos = parseFloat(scope.desconto_inss) + parseFloat(scope.desconto_irpf) + parseFloat(scope.funpresp) + parseFloat(scope.gratificacao_natalina_1);
		scope.gratificacao_natalina_2 = gratificacao_natalina_2.toFixed(2);
		scope.outros_descontos = scope.outros_descontos.toFixed(2);

	};

	function calcular_irpf(scope){
		scope.base_irpf = parseFloat(scope.vencimento_basico) + parseFloat(scope.incentivo_qualificacao) + parseFloat(scope.gratificacao_basico) - parseFloat(scope.desconto_inss) - parseFloat(scope.previdencia_complementar) - parseFloat(scope.funpresp);
		scope.base_irpf = scope.base_irpf.toFixed(2);
		
		var contador = 0;
		var percentual_irpf = 0;
		var abatimento_irpf = 0;
		var irpf = scope.everything[scope.estrutura].irpf;

		while((contador < irpf.length) && (irpf[contador][0] < scope.base_irpf)) {
			percentual_irpf = irpf[contador][1];
			abatimento_irpf = irpf[contador][2];
			contador++;
		};
		scope.aliquota_irpf = parseFloat(percentual_irpf * 100).toFixed(2);
		scope.aliquota_irpf += '%';
		scope.desconto_irpf = (scope.base_irpf * percentual_irpf) - abatimento_irpf;
		scope.desconto_irpf = parseFloat(scope.desconto_irpf).toFixed(2);
	};

	function calcular_funpresp(scope){
		var teto_inss = scope.everything[scope.estrutura].inss[2][0];
		scope.funpresp = (scope.base_funpresp - teto_inss) * scope.funpresp_input;
		scope.funpresp = scope.funpresp.toFixed(2);
	};

	function calcular_saude(scope){
		var indice = scope.saude_idades.indexOf(scope.saude_idade);
		scope.base_irpf = parseFloat(scope.vencimento_basico) + parseFloat(scope.incentivo_qualificacao) + parseFloat(scope.gratificacao_basico) - parseFloat(scope.desconto_inss) - parseFloat(scope.previdencia_complementar) - parseFloat(scope.funpresp);
		
		var contador = 0;
		var percentual_irpf = 0;
		var abatimento_irpf = 0;
		var saude = scope.everything[scope.estrutura].saude_valor;
		while((contador < saude.length) && (saude[contador][0] < scope.base_irpf)) {
			scope.saude_suplementar = saude[contador][indice+1];
			contador++;
		};
		scope.saude_suplementar = parseFloat(scope.saude_suplementar).toFixed(2);
	};
	
	$scope.indicar = function(valor){
		var indicator = jQuery('.indicador');
		if (valor == 0) {
          indicator.velocity({"right": '50%'}, { duration: 300, queue: false, easing: 'easeOutQuad'});
          indicator.velocity({"left": '0%'}, {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90});
          jQuery('#abainicio').css('color','#ffffff');
          jQuery('#abaresultado').css('color','#cccccc');
        } else {
          indicator.velocity({"left": '50%'}, { duration: 300, queue: false, easing: 'easeOutQuad'});
          indicator.velocity({"right": '0%'}, {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90});
          jQuery('#abainicio').css('color','#cccccc');
          jQuery('#abaresultado').css('color','#ffffff');
        };
	};

	$scope.show_resultado = function(value){
		if ($(window).width() < 993) {
			if(value == 1){
				$scope.showInicio = false;
				$scope.showResultado = true;
				return;
			} else {
				$scope.showInicio = true;
				$scope.showResultado = false;
				return;
			};
		};
		$scope.showInicio = true;
		$scope.showResultado = true;
		return;
	};

	function zerar(scope) {
	    //Salário
	    scope.load();
	    scope.salario_bruto = '0,00';
	    scope.total_desconto = '0,00';
	    scope.salario_liquido = '0,00';

	    //Receitas
	    scope.vencimento_basico = scope.vencimento_basico ? scope.vencimento_basico : '0,00';
	    scope.incentivo_qualificacao = '0,00';
	    scope.gratificacao_basico = '0,00';
	    scope.adicional_insalubridade = '0,00';
	    scope.auxilio_alimentacao = '0,00';
	    scope.auxilio_preescola = '0,00';
	    scope.auxilio_transporte = '0,00';
	    scope.outras = '0,00';
	    scope.saude_suplementar = '0,00';
	    scope.ferias = '0,00';
	    scope.gratificacao_natalina_1 = '0,00';
	    scope.gratificacao_natalina_2 = '0,00';

	    //Despesas
	    scope.base_inss = '0,00';
	    scope.aliquota_inss = '0%';
	    scope.desconto_inss = '0,00';
	    scope.base_irpf = '0,00';
	    scope.aliquota_irpf = '0%';
    	scope.desconto_irpf = '0,00';
    	scope.desconto_irpf_ferias = '0,00';
    	scope.previdencia_complementar = '0,00';
    	scope.funpresp = '0,00';
    	scope.outros_descontos = '0,00';

	};
	$scope.$on('reloadSelect', function(scope, element, attrs, ngModel){
		jQuery('select').material_select();
		jQuery('.brand-logo').focus().blur();
	});

	$http.get('json/propriedades.json').success(function(data) {
		everything = data;
		$scope.everything = data;
		$scope.load();
		$scope.estruturas = data["estruturas"];
		$scope.qualificacoes = data["qualificacoes"];
		$scope.tipos_relacoes = data["tipos_relacoes"];
		$scope.relacoes = data["relacoes"];
		$scope.classes = data["classes"];
		$scope.niveis = data["niveis"];
		$scope.gratificacoes = data["gratificacoes"];
		$scope.insalubridades = data["insalubridades"];
		$scope.saude_idades = data["saude_idade"];
		$scope.menor_vencimento = data["menor_vencimento"];
		$scope.saude_suplementar = data["saude_suplementar"];
		$scope.percentuais_funpresp = data["percentuais_funpresp"];
    	zerar($scope);
    	$scope.update();
    	$scope.loaded = "true";
    	jQuery('select').material_select();
	})
	.error(function(data, status, headers, config) {
		alert('Erro no acesso aos dados!');
	});
}]);

function fixar_abas(){
	var menu = $('.abas');
    var origOffsetY = menu.offset().top;
    function scroll() {

		if ($(window).width() < 993) {
			if ($(window).scrollTop() >= origOffsetY) {
	            $('.abas').addClass('sticky');
	            $('body').addClass('abas-padding');
	        } else {
	            $('.abas').removeClass('sticky');
	            $('body').removeClass('abas-padding');
	        };
		} else {
	            $('.abas').removeClass('sticky');
	            $('body').removeClass('abas-padding');
		};

    };

    document.onscroll = scroll;
};

$(document).ready(function () {
	fixar_abas();
});